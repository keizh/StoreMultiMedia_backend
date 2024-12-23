import { MongoOIDCError } from "mongodb";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ImageInterface } from "../types";

const ImageSchema = new mongoose.Schema<ImageInterface>(
  {
    imageId: {
      type: String,
      default: uuidv4,
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
    comments: [String],
    size: String,
  },
  { timestamps: true }
);

const ImageModel = mongoose.model<ImageInterface>("Album", ImageSchema);

export default ImageModel;
