// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface IUserPayload {
  id: number;
  email: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as IUserPayload;

    // gắn user vào request
    (req as any).user = { id: payload.id, email: payload.email };
    next();
  } catch (err: any) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
