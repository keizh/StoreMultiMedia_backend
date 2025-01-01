"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorizedAccess = (req, res, next) => {
    var _a;
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(400).json({ message: "NO TOKEN" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(authorization, (_a = process.env.SECRET_KEY) !== null && _a !== void 0 ? _a : "");
        req.user = decoded;
        next();
    }
    catch (err) {
        // const msg = err instanceof Error ? err.message : "Invalid token";
        return res.status(401).json({ message: "JWT_ERROR" });
    }
};
exports.default = authorizedAccess;
