import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { RequestHandler } from "express";
interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
}

interface AuthenticatedUser {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user: AuthenticatedUser;
      files?: Express.Multer.File[];
    }
  }
}

const authorizedAccess: RequestHandler = (req, res, next) => {
  const authorization: string | undefined = req.headers.authorization;
  if (!authorization) {
    res.status(400).json({ message: "NO TOKEN" });
    return;
  }

  if (!process.env.SECRET_KEY) {
    res.status(500).json({ message: "SERVER_CONFIGURATION_ERROR" });
    return;
  }

  try {
    const decoded = jwt.verify(
      authorization,
      process.env.SECRET_KEY ?? ""
    ) as CustomJwtPayload;

    if (!decoded.userId || !decoded.email) {
      res.status(401).json({ message: "INVALID_TOKEN_PAYLOAD" });
      return;
    }

    req.user = decoded;
    next();
  } catch (err) {
    // Irrespective of err being instance of jwt.TokenExpiredError & jwt.JsonWebTokenError
    res.status(401).json({ message: "JWT_ERROR" });
    return;
  }
};

export default authorizedAccess;
