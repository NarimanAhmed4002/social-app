"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentFactoryService = void 0;
const entity_1 = require("../entity");
class CommentFactoryService {
    createComment(createCommentDTO, user, post, comment) {
        const newComment = new entity_1.Comment();
        // const parentIds = comment.parentIds;
        newComment.content = createCommentDTO.content;
        newComment.userId = user._id;
        newComment.postId = post._id || comment?.postId; //replay endpoint comment/:id
        // if(comment)
        //     {newComment.parentIds = comment.parentIds;
        //     newComment.parentIds.push(comment._id);
        // };
        newComment.parentId = comment._id;
        newComment.reactions = [];
        return newComment;
    }
}
exports.CommentFactoryService = CommentFactoryService;
