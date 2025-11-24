"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
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
        const userId = req.user._id; // user id
        // check post existence
        const postExist = await this.postRepository.Exist({ _id: id });
        if (!postExist)
            throw new utils_1.NotFoundException("Post not found.");
        let userReactedIndex = postExist.reactions.findIndex((reaction) => {
            return reaction.userId.toString() == userId.toString();
        });
        if (userReactedIndex == -1) {
            await this.postRepository.update({ _id: id }, {
                $push: {
                    reactions: {
                        reaction: 
                        // if (reaction == null | undefined)  {REACTION.like}  else {reaction}
                        [null, undefined].includes(reaction) ? utils_1.REACTION.like : reaction,
                        userId,
                    },
                },
            });
        } // if req.body = undefined, null, "" , this means "remove reaction".
        else if ([undefined, null, ""].includes(reaction)) {
            await this.postRepository.update({ _id: id }, { $pull: { reactions: postExist.reactions[userReactedIndex] } });
        }
        else {
            await this.postRepository.update({ _id: id, "reactions.userId": userId }, { "reactions.$.reaction": reaction });
        }
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
}
exports.default = new PostService();
