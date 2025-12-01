"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
exports.commentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // model name >> User
        required: true, // even in anonymous particpant , the admin knows who are you
    },
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    parentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Comment",
    },
    content: { type: String },
    reactions: [common_1.reactionSchema],
    isFrozen: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.commentSchema.virtual("replies", {
    ref: "Comment",
    localField: "_id",
    foreignField: "parentId",
});
exports.commentSchema.pre("deleteOne", async function (next) {
    const filter = typeof this.getFilter === "function" ? this.getFilter() : {};
    const replies = await this.model.find({ parentId: filter._id });
    if (replies.length) {
        for (const reply of replies) {
            await this.model.deleteOne({ _id: reply._id });
        }
    }
    ;
    next();
});
