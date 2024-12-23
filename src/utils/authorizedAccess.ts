import jwt, { decode } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        email: string;
      };
    }
  }
}

const authorizedAccess = (req: Request, res: Response, next: NextFunction) => {
  const authorization: string | undefined = req.headers.authorization;

  if (!authorization) {
    return res.status(400).json({ message: "NO TOKEN" });
  }

  try {
    const decoded = jwt.verify(authorization, process.env.SECRET_KEY ?? "") as {
      userId: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (err) {
    // const msg = err instanceof Error ? err.message : "Invalid token";
    return res.status(401).json({ message: "JWT_ERROR" });
  }
};

export default authorizedAccess;
