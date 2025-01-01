import { Document, Types } from "mongoose";

import * as Express from "express";

declare global {
  namespace Express {
    interface Request {
      files?: Express.Multer.File[]; // For multiple files
    }
  }
}

// userDataFromFrontend
export interface User {
  userId: string;
  email: string;
}

// userDataFromDatabase

export interface UserDocInterface extends Document {
  email: string;
  userId: string;
}

// database-data-validation
export interface LoginORSignUpResponse {
  message: string;
  token?: string;
  apiEndPoint?: string;
}

export interface AlbumBase {
  albumId: string;
  name: string;
  description: string;
  ownerId: Types.ObjectId;
  sharedUsers: string[];
}

export interface AlbumInterface extends AlbumBase {}

export interface AlbumDocInterface extends AlbumBase, Document {}

export type commentOBJ = {
  comment: string;
  commentOwnerId: Types.ObjectId | string;
  commentId?: string;
};

export interface ImageInterface {
  imageId: string;
  imgURL: string;
  public_id: string;
  imgOwnerId: string;
  albumId: string;
  name?: string;
  tags?: string[];
  person?: string;
  isFavorite?: boolean;
  comments?: commentOBJ[];
  size: string;
}

export interface ImageDocInterface extends Document {
  imageId: string;
  imgURL: string;
  public_id: string;
  imgOwnerId: string;
  albumId: string;
  name?: string;
  tags?: string[];
  person?: string;
  isFavorite?: boolean;
  comments?: commentOBJ[];
  size: string;
}
