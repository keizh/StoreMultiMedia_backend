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
        res.status(400).json({ message: "NO TOKEN" });
        return;
    }
    if (!process.env.SECRET_KEY) {
        res.status(500).json({ message: "SERVER_CONFIGURATION_ERROR" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(authorization, (_a = process.env.SECRET_KEY) !== null && _a !== void 0 ? _a : "");
        if (!decoded.userId || !decoded.email) {
            res.status(401).json({ message: "INVALID_TOKEN_PAYLOAD" });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        // Irrespective of err being instance of jwt.TokenExpiredError & jwt.JsonWebTokenError
        res.status(401).json({ message: "JWT_ERROR" });
        return;
    }
};
exports.default = authorizedAccess;
