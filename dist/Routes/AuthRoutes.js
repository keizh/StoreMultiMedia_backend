"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
require("dotenv/config");
const authorizedAccess_1 = __importDefault(require("../utils/authorizedAccess"));
const authRouter = (0, express_1.Router)();
// Promise<void> , Promise because fn executes async job , void because it returns nothing
// PRODUCTION READY <-- wont be using this in this application
// authRouter.post(
//   "/signup",
//   async (
//     req: Request<{}, {}, LoginSignupRequestBody>,
//     res: Response<LoginSignupResponse>
//   ): Promise<void> => {
//     const { email, password, name } = req.body;
//     try {
//       // fetching User If it exists
//       const user: HydratedDocument<UserInterface> | null =
//         await UserModel.findOne({ email });
//       if (user) {
//         res.status(409).json({ message: `${email} is already registered` });
//         return;
//       }
//       //   hashed password is created
//       const hashedPassword: string = await bcrypt.hash(password, 5);
//       const newUser = new UserModel({ email, password: hashedPassword, name });
//       const savedUser: UserDocInterface = await newUser.save();
//       res.status(201).json({ message: `${email} has been registered` });
//     } catch (err: unknown) {
//       res.status(500).json({
//         message: `${err instanceof Error ? err.message : "unknown Error"}`,
//         apiEndPoint: "/api/v1/auth/signup",
//       });
//     }
//   }
// );
// PRODUCTION READY <-- wont be using this in this application
// authRouter.post(
//   "/login",
//   async (
//     req: Request<{}, {}, LoginSignupRequestBody>,
//     res: Response<LoginSignupResponse>
//   ): Promise<void> => {
//     const { email, password } = req.body;
//     try {
//       // finding user based on email
//       const user: UserInterface | null = await UserModel.findOne({ email });
//       if (!user) {
//         res.status(404).json({ message: "Email Id is not registered" });
//         return;
//       } else if (user.oauth) {
//         const googleOAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?
//         client_id=${process.env.GOOGLE_CLIENT_ID}&
//         redirect_uri=${process.env.GOOGLE_BACKEND_REDIRECT_URI}&
//         response_type=code&
//         scope=profile email`;
//         res.redirect(googleOAuthURL);
//         return;
//       }
//       const correctPWD: boolean = await bcrypt.compare(
//         password,
//         user.password ?? ""
//       );
//       if (!correctPWD) {
//         res.status(401).json({ message: "Incorrect Password" });
//         return;
//       }
//       const secretKey: string | void = process.env.SECRET_KEY;
//       if (!secretKey) {
//         throw new Error("Secret Key to generate JWT token is not provided");
//       }
//       const token: string = jwt.sign(
//         {
//           email: user.email,
//           name: user.name,
//           userId: user._id,
//         },
//         secretKey,
//         { expiresIn: "10h" }
//       );
//       res.status(200).json({ message: "Successfull Login", token });
//     } catch (error: unknown) {
//       res.status(500).json({
//         message: `${
//           error instanceof Error ? error.message : "Unknown message"
//         }`,
//         apiEndPoint: "/api/v1/auth/login",
//       });
//     }
//   }
// );
// PRODUCTION READY <-- google/ouath/redirection
authRouter.get("/google/oauth", (req, res) => {
    const googleOAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_BACKEND_REDIRECT_URI}&response_type=code&scope=profile email`;
    res.redirect(googleOAuthURL);
});
// PRODUCTION READY <-- google/callback/redirection
authRouter.get("/google/oauth/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { code } = req.query;
    try {
        const params = {
            code,
            client_id: (_a = process.env.GOOGLE_CLIENT_ID) !== null && _a !== void 0 ? _a : "",
            client_secret: (_b = process.env.GOOGLE_CLIENT_SECRET) !== null && _b !== void 0 ? _b : "",
            redirect_uri: (_c = process.env.GOOGLE_BACKEND_REDIRECT_URI) !== null && _c !== void 0 ? _c : "",
            grant_type: "authorization_code",
        };
        const fetchedData = yield fetch(`https://oauth2.googleapis.com/token`, {
            method: "POST",
            body: new URLSearchParams(params).toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
        });
        const { access_token } = yield fetchedData.json();
        // id & email
        const fetchRes2 = yield fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        });
        const data2 = yield fetchRes2.json();
        const { email, id } = data2;
        // Fetching User Email Id
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            // WHEN USER DOESNOT EXIST
            // CREATE NEW USER
            // SEND JWT
            const newUser = new UserModel_1.default({ email, userId: id });
            const newUserSaved = yield newUser.save();
            const token = jsonwebtoken_1.default.sign({
                email: newUserSaved.email,
                userId: newUserSaved._id,
            }, (_d = process.env.SECRET_KEY) !== null && _d !== void 0 ? _d : "", { expiresIn: "10h" });
            res.redirect(`${process.env.frontendURL}/user/auth/photos?token=${token}`);
            return;
        }
        // USER EXISTS
        const token = jsonwebtoken_1.default.sign({
            email: user.email,
            userId: user._id,
        }, (_e = process.env.SECRET_KEY) !== null && _e !== void 0 ? _e : "", { expiresIn: "10h" });
        res.redirect(`${process.env.frontendURL}/user/auth/photos?token=${token}`);
        return;
    }
    catch (err) {
        res.redirect(`${process.env.frontendURL}/user/login?issue=${err instanceof Error && err.message}`);
    }
}));
authRouter.get("/fetch/users", authorizedAccess_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    try {
        const userList = yield UserModel_1.default.find({
            email: { $nin: [email] },
        });
        res.status(200).json({ message: "Users Fetched", userList });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch students" });
    }
}));
exports.default = authRouter;
