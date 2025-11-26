import { IComment, IPost, IUser } from "../../../utils";
import { CreateCommentDTO } from "../comment.dto";
import { Comment } from "../entity";

export class CommentFactoryService {
  createComment(
    createCommentDTO: CreateCommentDTO,
    user: IUser,
    post: IPost,
    comment?: IComment
  ) {
    const newComment = new Comment();
    // const parentIds = comment.parentIds;
    newComment.content = createCommentDTO.content;
    newComment.userId = user._id;
    newComment.postId = post._id || comment?.postId; //replay endpoint comment/:id
    // if(comment)
    //     {newComment.parentIds = comment.parentIds;
    //     newComment.parentIds.push(comment._id);
    // };
    newComment.parentId = comment?._id || null;
    newComment.reactions = [];

    return newComment;
  }
}
