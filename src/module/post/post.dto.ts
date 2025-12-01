import { ObjectId } from "mongoose";

export interface CreatePostDTO {
    content:string;
    mentions?:ObjectId[]
    attachments?:any[]
}

export interface UpdatePostDTO {
    content?:string;
    mentions?:ObjectId[];
}