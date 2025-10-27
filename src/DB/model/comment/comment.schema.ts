import { Schema } from "mongoose";
import { IComment } from "../../../utils";
import { reactionSchema } from "../common";

export const commentSchema = new Schema<IComment>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User", // model name >> User
        required:true, // even in anonymous particpant , the admin knows who are you
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:true,
    },
    parentIds:{
        type:Schema.Types.ObjectId,
        ref:"Comment",
    }, 
    content:{type:String},
    reactions:[reactionSchema]
},{timestamps:true});