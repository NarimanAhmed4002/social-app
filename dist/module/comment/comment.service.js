"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
const factory_1 = require("./factory");
const react_provider_1 = require("../../utils/common/providers/react.provider");
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
    getSpecificComment = async (req, res) => {
        const { id } = req.params;
        const commentExist = await this.commentRepository.Exist({ _id: id });
        if (!commentExist)
            throw new utils_1.NotFoundException("Comment not found.");
        return res.status(200).json({
            message: "Comment fetched successfully.",
            success: true,
            data: { commentExist },
        });
    };
    deleteComment = async (req, res) => {
        // get comment id from params
        const { id } = req.params;
        // check comment existence
        const commentExist = await this.commentRepository.Exist({ _id: id }, {}, { populate: [{ path: "postId", select: "userId" }] });
        if (!commentExist)
            throw new utils_1.NotFoundException("Comment not found.");
        // check comment ownership
        if (commentExist.userId.toString() !== req.user._id.toString() &&
            commentExist.postId.userId.toString() !== req.user._id.toString()) {
            throw new utils_1.UnAuthorizedException("You are not authorized to delete this comment.");
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
    addReaction = async (req, res) => {
        // get data from req
        const { id } = req.params; // comment id
        const { reaction } = req.body; // user reaction
        const userId = req.user.id; // user id
        // add reaction using provider
        await (0, react_provider_1.addReactionProvider)(this.commentRepository, id, userId, reaction);
        // send response
        return res.status(204);
    };
}
exports.CommentService = CommentService;
exports.default = new CommentService();
