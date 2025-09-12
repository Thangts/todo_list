// backend/src/utils/token.util.ts
import jwt from "jsonwebtoken";

interface IUserToken {
  id: number;
  email: string;
}

// ================== ACCESS TOKEN ==================
export function generateAccessToken(user: IUserToken) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
}

// ================== REFRESH TOKEN ==================
export function generateRefreshToken(user: IUserToken) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
}

// ================== VERIFY REFRESH TOKEN ==================
export function verifyRefreshToken(token: string): IUserToken {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as IUserToken;
}
