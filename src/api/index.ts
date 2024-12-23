import "dotenv/config";
import express, { Express, Response, Request } from "express";
import cors from "cors";
import authRouter from "../Routes/AuthRoutes";
import dbConnect from "../utils/dbConnectFunction";
import { v2 as cloudinary } from "cloudinary";
import { AlbumRouter } from "../Routes/AlbumRoute";
import { imageRouter } from "../Routes/ImageRoutes";
dbConnect();

const app: Express = express();

const corsOptions: {
  origin: string;
  allowedMethods: string[];
  allowedHeaders: string[];
  optionsSuccessStatus: number;
  credentails?: boolean;
} = {
  origin: "*",
  allowedMethods: ["GET", "PUSH", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Accept", "Authorization"],
  //   credentails: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/album", AlbumRouter);
app.use("/api/v1/image", imageRouter);

app.get("/", (req: Request, res: Response): void => {
  res.status(200).send("working");
});

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5500;

app.listen(PORT, (): void => console.log(`Web-server is Online`));
