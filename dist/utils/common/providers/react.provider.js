"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReactionProvider = void 0;
const error_1 = require("../../error");
const addReactionProvider = async (repo, id, userId, reaction) => {
    // check post existence
    const postExist = await repo.Exist({ _id: id });
    if (!postExist)
        throw new error_1.NotFoundException("Post not found.");
    let userReactedIndex = postExist.reactions.findIndex((reaction) => {
        return reaction.userId.toString() == userId.toString();
    });
    if (userReactedIndex == -1) {
        await repo.update({ _id: id }, {
            $push: {
                reactions: {
                    reaction,
                    //   // if (reaction == null | undefined)  {REACTION.like}  else {reaction}
                    //   [null, undefined].includes(reaction) ? REACTION.like : reaction,
                    userId,
                },
            },
        });
    } // if req.body = undefined, null, "" , this means "remove reaction".
    else if ([undefined, null, ""].includes(reaction)) {
        await repo.update({ _id: id }, { $pull: { reactions: postExist.reactions[userReactedIndex] } });
    }
    else {
        await repo.update({ _id: id, "reactions.userId": userId }, { "reactions.$.reaction": reaction });
    }
};
exports.addReactionProvider = addReactionProvider;
