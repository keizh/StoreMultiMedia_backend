import mongoose from "mongoose";
import { UserInterface } from "../types";

const UserSchema = new mongoose.Schema<UserInterface>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      default: "outh route used",
    },
    name: {
      type: String,
      required: true,
    },
    oauth: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<UserInterface>("User", UserSchema);

export default UserModel;
