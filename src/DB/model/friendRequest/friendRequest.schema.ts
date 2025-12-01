import { Schema } from "mongoose";
import { FREINDREQUESTSTATUS, IFriendRequest } from "../../../utils";

export const friendRequestSchema = new Schema <IFriendRequest>(
  {
    from: { type: Schema.Types.ObjectId, ref: "User" },
    to: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: Number,
      enum: FREINDREQUESTSTATUS,
      default: FREINDREQUESTSTATUS.pending,
    },
  },
  {
    timestamps: true,
  }
);
