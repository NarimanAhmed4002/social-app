import { Schema } from "mongoose";
import { IPost } from "../../../utils";
import { reactionSchema } from "../common";
import { Comment } from "../comment/comment.model";

export const postSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      // required:function (){
      //     if(this.attachments) return false;
      //     return true;
      // },
      trim: true,
    },
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isFrozen:{
      type:Boolean,
      default:false,
    },
    isDeleted:{
      type:Boolean,
      default:false,
    },
    reactions: [reactionSchema],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual("comments", {
  localField: "_id", // postId in post
  foreignField: "postId", // postId in comment
  ref: "Comment", // Comment model
});

postSchema.pre("deleteOne", async function (next) {
  const filter = typeof this.getFilter === "function" ? this.getFilter() : {};
  // const comments = await Comment.find({postId:filter._id, parentId: null});
  // if(comments.length){
  //     for(const comment of comments){
  //         await Comment.deleteOne({_id:comment._id});
  // }};
  // next();
  await Comment.deleteMany({ postId: filter._id });
  next();
});
