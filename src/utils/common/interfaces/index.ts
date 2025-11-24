import { GENDER, REACTION, SYS_ROLE, USER_AGENT } from "../../../utils";
import { Document, ObjectId } from "mongoose";

export interface IAttachment {
  url: string;
  id: string;
}

export interface IReaction {
  userId: ObjectId;
  reaction: REACTION;
}

export interface IUser {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  password: string;
  dob: Date;
  phone?: string;
  credentialsUpdatedAt: number;
  role: SYS_ROLE;
  gender: GENDER;
  userAgent: USER_AGENT;
  otp?: string;
  otpExpireAt: Date;
  isVerified: boolean;
}

export interface IPost {
  _id: ObjectId;
  userId: ObjectId;
  content: string;
  reactions: IReaction[];
  // attachments?:IAttachment
}

export interface IComment {
  _id: ObjectId;
  userId: ObjectId;
  postId: ObjectId;
  parentId: ObjectId | null; // sorted paren1, parent2, parent3, ...
  content: string;
  attachment?: IAttachment;
  reactions: IReaction[];
  mentions: ObjectId[];
}

// Re-open interfaces
declare module "jsonwebtoken" {
  interface payload {
    _id: string;
    role: string;
  }
}
declare module "express" {
  interface Request {
    user: IUser & Document;
  }
}
