import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserType } from "src/models/Entity.type";
import { NextFunction, Request, Response } from "express";
dotenv.config();

export const signJWT = (payload: {
  id: number;
  email: string;
  nickname: string;
}) => {
  const secret = process.env.JWT_SECRET!;

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
          resolve({ message: info.message });
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

export const googleAuthenticate = () => {
  return passport.authenticate("google", { scope: ["email", "profile"] });
};

export const googleCallbackAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "google",
      { session: false },
      (err, user, info, status) => {
        if (err) {
          reject(err.message);
        }
        resolve(user);
      }
    )(req, res, next);
  });
};

export const kakaoAuthenticate = () => {
  return passport.authenticate("kakao");
};

export const kakaoCallbackAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "kakao",
      { session: false },
      (err: any, user: UserType) => {
        if (err) {
          reject(err.message);
        }
        resolve(user);
      }
    )(req, res, next);
  });
};
