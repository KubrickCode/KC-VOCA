import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserType } from "src/models/types";
dotenv.config();

export const signJWT = (payload: {
  id: number;
  email: string;
  nickname: string;
}) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT 시크릿 키가 없습니다");
  }
  const token = jwt.sign(payload, secret, {
    expiresIn: "30d",
  });

  return token;
};

export const loginAuthenticate = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "local",
      { session: false },
      (err: any, user: UserType, info: any) => {
        if (err) {
          reject(err);
        } else if (!user) {
          reject({ status: 400, message: info.message });
        } else {
          const { id, email, nickname } = user;
          const payload = { id, email, nickname };
          const token = signJWT(payload);
          resolve(token);
        }
      }
    )({ body: { email, password } });
  });
};
