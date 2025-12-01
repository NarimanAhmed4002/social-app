import { Request, Response } from "express";
import { CommentRepository, PostRepository, UserRepository } from "../../DB";
import {
  IComment,
  IPost,
  NotFoundException,
  UnAuthorizedException,
} from "../../utils";
import { CommentFactoryService } from "./factory";
import { CreateCommentDTO } from "./comment.dto";
import { addReactionProvider } from "../../utils/common/providers/react.provider";
import { ObjectId } from "mongoose";
import { emailEvent } from "../../utils/event";

export class CommentService {
  private readonly postRepository = new PostRepository();
  private readonly commentRepository = new CommentRepository();
  private readonly userRepository = new UserRepository();
  private readonly commentFactoryService = new CommentFactoryService();
  public addComment = async (req: Request, res: Response) => {
    // get data from req
    const { postId, id } = req.params; // post id / comment id
    const createCommentDTO: CreateCommentDTO = req.body;

    // check post existence
    const postExist = await this.postRepository.Exist({ _id: postId });
    if (!postExist) throw new NotFoundException("Post not found.");

    //check comment existence
    let commentExist: IComment | any = undefined;
    // check if id provided >> check parent comment >> reply to comment
    // لو فيه ايدي اتبعت دة معناه ان فيه كومنت اساسا و هنريبلاي عليه
    if (id) {
      commentExist = await this.commentRepository.Exist({ _id: id });
      if (!commentExist) throw new NotFoundException("Comment not found.");
    }

    // prepare comment data
    const comment = this.commentFactoryService.createComment(
      createCommentDTO,
      req.user,
      postExist,
      commentExist
    );

    // create in DB
    const createdComment = await this.commentRepository.create(comment);
    // createdComment.parentIds = [];
    // createdComment.markModified("parentIds");
    // await createdComment.save();
    // send response
    return res.status(201).json({
      message: "Comment created successfully.",
      success: true,
      data: { createdComment },
    });
  };

  public getSpecificComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const commentExist = await this.commentRepository.Exist({ _id: id });
    if (!commentExist) throw new NotFoundException("Comment not found.");
    return res.status(200).json({
      message: "Comment fetched successfully.",
      success: true,
      data: { commentExist },
    });
  };

  public deleteComment = async (req: Request, res: Response) => {
    // get comment id from params
    const { id } = req.params;
    // check comment existence
    const commentExist = await this.commentRepository.Exist(
      { _id: id },
      {},
      { populate: [{ path: "postId", select: "userId" }] }
    );
    if (!commentExist) throw new NotFoundException("Comment not found.");
    // check comment ownership
    if (
      commentExist.userId.toString() !== req.user._id.toString() &&
      (commentExist.postId as unknown as IPost).userId.toString() !==
        req.user._id.toString()
    ) {
      throw new UnAuthorizedException(
        "You are not authorized to delete this comment."
      );
    }
    /**
     if(![commentExist.userId.toString(), (commentExist.postId as unknown as IPost).userId.toString()].includes(req.user._id.toString())){
        throw new UnAuthorizedException("You are not authorized to delete this comment.");
    }
     */
    // delete comment
    await this.commentRepository.delete({ _id: id });
    // send response
    return res.status(200).json({
      message: "Comment deleted successfully.",
      success: true,
    });
  };

  public addReaction = async (req: Request, res: Response) => {
    // get data from req
    const { id } = req.params; // comment id
    const { reaction } = req.body; // user reaction
    const userId = req.user.id; // user id
    // add reaction using provider
    await addReactionProvider(this.commentRepository, id, userId, reaction);
    // send response
    return res.status(204);
  };

  public freezeComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const user = req.user;

    const commentExist = await this.commentRepository.Exist({
      _id: commentId,
      isFrozen: false,
    });
    if (!commentExist)
      throw new NotFoundException("Comment not found or already frozen.");

    if (user._id.toString() !== commentExist.userId.toString()) {
      throw new UnAuthorizedException(
        "You are not authorized to freeze this comment."
      );
    }

    await this.commentRepository.update(
      { _id: commentId },
      { $set: { isFrozen: true } }
    );

    return res.status(200).json({
      message: "Comment frozen successfully.",
      success: true,
    });
  };

  public unfreezeComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const user = req.user;

    const commentExist = await this.commentRepository.Exist({
      _id: commentId,
      isFrozen: true,
    });
    if (!commentExist)
      throw new NotFoundException("Comment not found or not even frozen.");

    if (user._id.toString() !== commentExist.userId.toString()) {
      throw new UnAuthorizedException(
        "You are not authorized to unfreeze this comment."
      );
    }
    await this.commentRepository.update(
      { _id: commentId },
      { $set: { isFrozen: false } }
    );

    return res.status(200).json({
      message: "Comment unfrozen successfully.",
      success: true,
    });
  };

  public updateComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const { content, mentions = [] }: Partial<CreateCommentDTO> = req.body;
    const user = req.user;
    const commentExist = await this.commentRepository.Exist({
      _id: commentId,
      isFrozen: false,
    });
    if (!commentExist)
      throw new NotFoundException("Comment not found or frozen.");
    if (user._id.toString() !== commentExist.userId.toString()) {
      throw new UnAuthorizedException(
        "You are not authorized to update this comment."
      );
    }
    const postExist = await this.postRepository.Exist({
      _id: commentExist.postId,
      isFrozen: false,
    });
    if (!postExist)
      throw new NotFoundException("Associated post not found or frozen.");

    if (commentExist.parentId) {
      const parentCommentExist = await this.commentRepository.Exist({
        _id: commentExist.parentId,
        isFrozen: false,
      });
      if (!parentCommentExist)
        throw new NotFoundException(
          "Associated parent comment not found or frozen."
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
          type: "comment",
        });
      }
    }

    if (content) commentExist.content = content;
    if (mentions) commentExist.mentions = validMentionedUsers;

    await commentExist.save();
    return res.status(200).json({
      message: "Comment updated successfully.",
      success: true,
    });
  };

  public hardDeleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const user = req.user;
    const commentExist = await this.commentRepository.Exist(
      { _id: commentId, isDeleted: false },
      {},
      {
        populate: [{ path: "postId", select: "userId" }],
      }
    );
    if (!commentExist)
      throw new NotFoundException("Comment not found or already deleted.");
    if (
      commentExist.userId.toString() !== user._id.toString() &&
      (commentExist.postId as unknown as IPost).userId.toString() !==
        user._id.toString()
    ) {
      throw new UnAuthorizedException(
        "You are not authorized to delete this comment."
      );
    }
    const deletedCommentCount = await this.commentRepository.deleteM({
      $or: [{ _id: commentId, parentId: commentId }],
    });
    await commentExist.save();
    return res.status(200).json({
      message: "Comment hard deleted successfully.",
      success: true,
      data: { deletedCommentCount },
    });
  };
}

export default new CommentService();
