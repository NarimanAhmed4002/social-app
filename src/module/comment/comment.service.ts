import { Request, Response } from "express";
import { CommentRepository, PostRepository } from "../../DB";
import { IComment, NotFoundException } from "../../utils";
import { CommentFactoryService } from "./factory";
import { CreateCommentDTO } from "./comment.dto";

export class CommentService {
  private readonly postRepository = new PostRepository();
  private readonly commentRepository = new CommentRepository();
  private readonly commentFactoryService = new CommentFactoryService();
  addComment = async (req: Request, res: Response) => {
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
}

export default new CommentService();
