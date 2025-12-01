import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { CommentRepository, PostRepository, UserRepository } from "../../DB";
import { NotFoundException, UnAuthorizedException } from "../../utils";
import { addReactionProvider } from "../../utils/common/providers/react.provider";
import { emailEvent } from "../../utils/event";
import { PostFactoryService } from "./factory";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto";

class PostService {
  private readonly postFactoryService = new PostFactoryService();
  private readonly postRepository = new PostRepository();
  private readonly userRepository = new UserRepository();
  private readonly commentRepository = new CommentRepository();

  public create = async (req: Request, res: Response) => {
    // get data from req
    const user = req.user;
    const { content, mentions = [] }: CreatePostDTO = req.body;
    // factory >> prepare data post >> post entity >> repository
    // repository >> post entity >> DB
    const validMentionedUsers: ObjectId[] = [];
    if (mentions.length) {
      for (const userId of mentions) {
        const mentionedUser = await this.userRepository.Exist({ _id: userId });
        if (!mentionedUser) {
          throw new NotFoundException(
            `Mentioned user with id ${userId} not found.`
          );
        }
        validMentionedUsers.push(mentionedUser._id);
        emailEvent.emit("Mention", {
          user: user.email,
          to: mentionedUser.email,
        });
      }
    }
    const post = await this.postFactoryService.createPost(
      { content, mentions: validMentionedUsers },
      req.user
    );
    // save in DB
    const createdPost = await this.postRepository.create(post);
    //
    return res.status(201).json({
      message: "Post created successfully.",
      success: true,
      data: { createdPost },
    });
  };

  public addReaction = async (req: Request, res: Response) => {
    // get data from req
    const { id } = req.params; // post id
    const { reaction } = req.body; // user reaction
    const userId = req.user.id; // user id
    // add reaction using provider
    await addReactionProvider(this.postRepository, id, userId, reaction);

    // send response
    return res.status(204);
  };

  public getSpecificPost = async (req: Request, res: Response) => {
    // get data from req
    const { id } = req.params; // post id
    const post = await this.postRepository.getOne(
      { _id: id },
      {},
      {
        populate: [
          { path: "userId", select: "fullName firstName lastName" }, // any virtuals must put their original fields in select
          { path: "reaction.userId", select: "fullName firstName lastName" },
          { path: "comments", match: { parentId: null } }, // only top-level comments},
        ],
      }
    );

    if (!post) throw new NotFoundException("Post not found.");
    return res.status(200).json({
      message: "Done",
      success: true,
      data: { post },
    });
  };

  public deletePost = async (req: Request, res: Response) => {
    // get post id from params
    const { id } = req.params;
    // check post existence
    const postExist = await this.postRepository.Exist({ _id: id });
    if (!postExist) throw new NotFoundException("Post not found.");
    // check post ownership
    if (postExist.userId.toString() !== req.user._id.toString()) {
      throw new UnAuthorizedException(
        "You are not authorized to delete this post."
      );
    }
    // delete post
    await this.postRepository.delete({ _id: id });
    // send response
    return res.status(200).json({
      message: "Post deleted successfully.",
      success: true,
    });
  };

  public freezePost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const user = req.user;

    const postExist = await this.postRepository.Exist({
      _id: postId,
      isFrozen: false,
    });
    if (!postExist) throw new NotFoundException("Post not found.");

    if (postExist.userId.toString() !== user._id.toString()) {
      throw new UnAuthorizedException(
        "You are not authorized to freeze this post."
      );
    }

    await this.postRepository.update(
      { _id: postId },
      { $set: { isFrozen: true } }
    );
    return res.status(200).json({
      message: "Post frozen successfully.",
      success: true,
    });
  };

  public unfreezePost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const user = req.user;

    const postExist = await this.postRepository.Exist({
      _id: postId,
      isFrozen: true,
    });
    if (!postExist)
      throw new NotFoundException("Post not found or not even frozen.");

    if (postExist.userId.toString() !== user._id.toString()) {
      throw new UnAuthorizedException(
        "You are not authorized to unfreeze this post."
      );
    }

    await this.postRepository.update(
      { _id: postId },
      { $set: { isFrozen: false } }
    );
    return res.status(200).json({
      message: "Post unfrozen successfully.",
      success: true,
    });
  };

  public updatePost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { content, mentions = [] }: UpdatePostDTO = req.body;
    const user = req.user;
    const postExist = await this.postRepository.Exist({
      _id: postId,
      isFrozen: false,
    });
    if (!postExist) throw new NotFoundException("Post not found or freezed.");

    if (postExist.userId.toString() !== user._id.toString()) {
      throw new UnAuthorizedException(
        "You are not authorized to update this post."
      );
    }

    const validMentionedUsers: ObjectId[] = [];
    if (mentions.length) {
      for (const userId of mentions) {
        const mentionedUser = await this.userRepository.Exist({ _id: userId });
        if (!mentionedUser) {
          throw new NotFoundException(
            `Mentioned user with id ${userId} not found.`
          );
        }
        validMentionedUsers.push(mentionedUser._id);
        emailEvent.emit("Mention", {
          user: user.email,
          to: mentionedUser.email,
          type: "post",
        });
      }
    }

    if (content) postExist.content = content;
    if (mentions) postExist.mentions = validMentionedUsers;

    await postExist.save();
    const updatedPost = postExist;

    return res.status(200).json({
      message: "Post updated successfully.",
      success: true,
      data: { updatedPost },
    });
  };

  public hardDeletePost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const user = req.user;
    const postExist = await this.postRepository.Exist({
      _id: postId,
      isDeleted: false,
    });
    if (!postExist)
      throw new NotFoundException("Post not found or already deleted.");
    if (postExist.userId.toString() !== user._id.toString()) {
      throw new UnAuthorizedException(
        "You are not authorized to delete this post."
      );
    }
    await this.postRepository.delete({ _id: postId });
    await this.commentRepository.deleteM({ postId: postId });

    return res.status(200).json({
      message: "post deleted successfully.",
      success: true,
    });
  };
}

export default new PostService();
