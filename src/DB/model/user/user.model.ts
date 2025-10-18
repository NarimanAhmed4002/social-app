import { model } from "mongoose";
import { IUser } from "../../../utils";
import { userSchema } from "./user.schema";

export const User = model<IUser>("User", userSchema);

// Contains logic interacting directly with the database (CRUD operations).