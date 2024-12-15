import "dotenv/config";
import express, { Express, Response, Request } from "express";
import cors from "cors";
import authRouter from "./Routes/AuthRoutes";
import dbConnect from "./utils/dbConnectFunction";
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
app.use("/api/v1/auth", authRouter);
// /api/v1/auth/google/oauth/callback
app.get("/", (req: Request, res: Response): void => {
  res.status(200).send("working");
});

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5500;

app.listen(PORT, (): void => console.log(`Web-server is Online`));
