"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
const factory_1 = require("./factory");
const react_provider_1 = require("../../utils/common/providers/react.provider");
class PostService {
    postFactoryService = new factory_1.PostFactoryService();
    postRepository = new DB_1.PostRepository();
    create = async (req, res) => {
        // get data from req
        const createPostDTO = req.body;
        // factory >> prepare data post >> post entity >> repository
        // repository >> post entity >> DB
        const post = await this.postFactoryService.createPost(createPostDTO, req.user);
        // save in DB
        const createdPost = await this.postRepository.create(post);
        //
        return res.status(201).json({
            message: "Post created successfully.",
            success: true,
            data: { createdPost },
        });
    };
    addReaction = async (req, res) => {
        // get data from req
        const { id } = req.params; // post id
        const { reaction } = req.body; // user reaction
        const userId = req.user.id; // user id
        // add reaction using provider
        await (0, react_provider_1.addReactionProvider)(this.postRepository, id, userId, reaction);
        // send response
        return res.status(204);
    };
    getSpecificPost = async (req, res) => {
        // get data from req
        const { id } = req.params; // post id
        const post = await this.postRepository.getOne({ _id: id }, {}, {
            populate: [
                { path: "userId", select: "fullName firstName lastName" }, // any virtuals must put their original fields in select
                { path: "reaction.userId", select: "fullName firstName lastName" },
                { path: "comments", match: { parentId: null } }, // only top-level comments},
            ],
        });
        if (!post)
            throw new utils_1.NotFoundException("Post not found.");
        return res.status(200).json({
            message: "Done",
            success: true,
            data: { post },
        });
    };
    deletePost = async (req, res) => {
        // get post id from params
        const { id } = req.params;
        // check post existence
        const postExist = await this.postRepository.Exist({ _id: id });
        if (!postExist)
            throw new utils_1.NotFoundException("Post not found.");
        // check post ownership
        if (postExist.userId.toString() !== req.user._id.toString()) {
            throw new utils_1.UnAuthorizedException("You are not authorized to delete this post.");
        }
        // delete post
        await this.postRepository.delete({ _id: id });
        // send response
        return res.status(200).json({
            message: "Post deleted successfully.",
            success: true,
        });
    };
    freezePost = async (req, res) => {
        const { postId } = req.params;
        const user = req.user;
        const postExist = await this.postRepository.Exist({ _id: postId, isFrozen: false });
        if (!postExist)
            throw new utils_1.NotFoundException("Post not found.");
        if (postExist.userId.toString() !== user._id.toString()) {
            throw new utils_1.UnAuthorizedException("You are not authorized to freeze this post.");
        }
        ;
        await this.postRepository.update({ _id: postId }, { $set: { isFrozen: true } });
        return res.status(200).json({
            message: "Post frozen successfully.",
            success: true,
        });
    };
    unfreezePost = async (req, res) => {
        const { postId } = req.params;
        const user = req.user;
        const postExist = await this.postRepository.Exist({ _id: postId, isFrozen: true });
        if (!postExist)
            throw new utils_1.NotFoundException("Post not found or not even frozen.");
        if (postExist.userId.toString() !== user._id.toString()) {
            throw new utils_1.UnAuthorizedException("You are not authorized to unfreeze this post.");
        }
        ;
        await this.postRepository.update({ _id: postId }, { $set: { isFrozen: false } });
        return res.status(200).json({
            message: "Post unfrozen successfully.",
            success: true,
        });
    };
}
exports.default = new PostService();
