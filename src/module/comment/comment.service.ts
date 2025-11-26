import { Request, Response } from "express";
import { CommentRepository, PostRepository } from "../../DB";
import {
  IComment,
  IPost,
  NotFoundException,
  UnAuthorizedException,
} from "../../utils";
import { CommentFactoryService } from "./factory";
import { CreateCommentDTO } from "./comment.dto";
import { addReactionProvider } from "../../utils/common/providers/react.provider";

export class CommentService {
  private readonly postRepository = new PostRepository();
  private readonly commentRepository = new CommentRepository();
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
      (commentExist.postId as unknown as IPost).userId.toString() !== req.user._id.toString()
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
  }
}

export default new CommentService();
