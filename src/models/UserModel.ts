import mongoose from "mongoose";
import { User } from "../types";

const UserSchema = new mongoose.Schema<User>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<User>("User", UserSchema);

export default UserModel;
