import { MongoOIDCError } from "mongodb";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ImageInterface } from "../types";

const ImageSchema = new mongoose.Schema<ImageInterface>(
  {
    imageId: {
      type: String,
      default: uuidv4,
      index: true,
    },
    imgURL: {
      type: String,
      require: true,
    },
    imgOwnerId: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    albumId: {
      type: String,
      index: true,
    },
    name: String,
    tags: [String],
    person: String,
    isFavorite: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        comment: String,
        commentOwnerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        commentId: {
          type: String,
          default: uuidv4,
        },
      },
    ],
    size: String,
  },
  { timestamps: true }
);

const ImageModel = mongoose.model<ImageInterface>("Album", ImageSchema);

export default ImageModel;
