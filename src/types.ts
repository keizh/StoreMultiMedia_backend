import { Document, Types } from "mongoose";

// to be used for frontend
export interface UserInterface {
  email: string;
  password?: string;
  name: string;
  _id?: string | Types.ObjectId;
  oauth?: boolean;
}

// to be used for backend
export interface UserDocInterface extends Document {
  email: string;
  password?: string;
  name: string;
  _id: string | Types.ObjectId;
  oauth?: boolean;
}

export interface LoginSignupResponse {
  message: string;
  token?: string;
  apiEndPoint?: string;
}

export interface LoginSignupRequestBody {
  email: string;
  password: string;
  name?: string;
}
