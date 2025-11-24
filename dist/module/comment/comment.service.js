"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
const factory_1 = require("./factory");
class CommentService {
    postRepository = new DB_1.PostRepository();
    commentRepository = new DB_1.CommentRepository();
    commentFactoryService = new factory_1.CommentFactoryService();
    addComment = async (req, res) => {
        // get data from req
        const { postId, id } = req.params; // post id / comment id
        const createCommentDTO = req.body;
        // check post existence
        const postExist = await this.postRepository.Exist({ _id: postId });
        if (!postExist)
            throw new utils_1.NotFoundException("Post not found.");
        //check comment existence
        let commentExist = undefined;
        // check if id provided >> check parent comment >> reply to comment
        // لو فيه ايدي اتبعت دة معناه ان فيه كومنت اساسا و هنريبلاي عليه
        if (id) {
            commentExist = await this.commentRepository.Exist({ _id: id });
            if (!commentExist)
                throw new utils_1.NotFoundException("Comment not found.");
        }
        // prepare comment data
        const comment = this.commentFactoryService.createComment(createCommentDTO, req.user, postExist, commentExist);
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
exports.CommentService = CommentService;
exports.default = new CommentService();
