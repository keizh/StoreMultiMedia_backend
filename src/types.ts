import { Document, Types } from "mongoose";

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

export interface AlbumInterface {
  albumId: string;
  name: string;
  description: string;
  ownerId: Types.ObjectId;
  sharedUsers: string[];
}

export interface AlbumDocInterface extends Document {
  albumId: string;
  name: string;
  description: string;
  ownerId: Types.ObjectId;
  sharedUsers: string[];
}

export interface ImageInterface {
  imageId: string;
  albumId: string;
  name?: string;
  tags?: string[];
  person?: string;
  isFavorite?: boolean;
  comments?: string[];
  size: string;
}

export interface ImageDocInterface extends Document {
  imageId: string;
  albumId: string;
  name?: string;
  tags?: string[];
  person?: string;
  isFavorite?: string;
  comments?: string[];
  size: string;
}
