import { ObjectId } from "mongoose";

export interface CreateCommentDTO {
    content: string;
    attachment?: any;
    mentions?: ObjectId[];
}