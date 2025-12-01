import { model } from "mongoose";
import { friendRequestSchema } from "./friendRequest.schema";
import { IFriendRequest } from "../../../utils";

export const FriendRequest = model<IFriendRequest>("FriendRequest", friendRequestSchema);