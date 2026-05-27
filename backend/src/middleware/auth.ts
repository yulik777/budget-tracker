import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
      return;
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    req.userId = payload.userId;
    req.email = payload.email;

    next();
  } catch {
    res.status(401).json({ error: "Authentication failed" });
  }
}

type AppError = {
  status?: number;
  message?: string;
};

export const errorMiddleware: ErrorRequestHandler = (
  err: unknown,
  _req,
  res,
) => {
  console.error(err);

  const error = err as AppError;

  res.status(error.status ?? 500).json({
    error: error.message ?? "Internal server error",
  });
};
