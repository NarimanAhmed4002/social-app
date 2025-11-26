import { Request, Response } from "express";
import { PostRepository } from "../../DB";
import {
  NotFoundException,
  REACTION,
  UnAuthorizedException,
} from "../../utils";
import { PostFactoryService } from "./factory";
import { CreatePostDTO } from "./post.dto";
import { Post } from "../../DB/model/post/post.model";
import { addReactionProvider } from "../../utils/common/providers/react.provider";

class PostService {
  private readonly postFactoryService = new PostFactoryService();
  private readonly postRepository = new PostRepository();

  public create = async (req: Request, res: Response) => {
    // get data from req
    const createPostDTO: CreatePostDTO = req.body;
    // factory >> prepare data post >> post entity >> repository
    // repository >> post entity >> DB
    const post = await this.postFactoryService.createPost(
      createPostDTO,
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
}

export default new PostService();
