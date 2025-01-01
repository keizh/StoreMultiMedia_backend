"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const AuthRoutes_1 = __importDefault(require("../Routes/AuthRoutes"));
const dbConnectFunction_1 = __importDefault(require("../utils/dbConnectFunction"));
const cloudinary_1 = require("cloudinary");
const AlbumRoute_1 = require("../Routes/AlbumRoute");
const ImageRoutes_1 = require("../Routes/ImageRoutes");
(0, dbConnectFunction_1.default)();
const app = (0, express_1.default)();
const corsOptions = {
    origin: "*",
    allowedMethods: ["GET", "POST", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    //   credentails: true,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
app.use("/api/v1/auth", AuthRoutes_1.default);
app.use("/api/v1/album", AlbumRoute_1.AlbumRouter);
app.use("/api/v1/image", ImageRoutes_1.imageRouter);
app.get("/", (req, res) => {
    res.status(200).send("working");
});
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5500;
app.listen(PORT, () => console.log(`Web-server is Online`));
