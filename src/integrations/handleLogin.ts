import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserType } from "../models/Entity.type";
import { NextFunction, Request, Response } from "express";
import { getRefreshToken, storeRefreshToken } from "../models/Redis";
dotenv.config();

export const signJWT = (payload: {
  id: number;
  email: string;
  nickname: string;
}) => {
  const secret = process.env.JWT_SECRET!;
  const refreshSecret = process.env.JWT_REFRESH_SECRET!;

  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(payload, refreshSecret, {
    algorithm: "HS256",
    expiresIn: "14d",
  });

  return { token, refreshToken };
};

export const verifyRefreshToken = (refreshToken: string) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET!;

  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, refreshSecret, async (err, user) => {
      if (err) {
        return resolve(false);
      }

      const { id, email, nickname } = user as UserType;
      const existingRefreshToken = await getRefreshToken(id);

      if (!existingRefreshToken || existingRefreshToken !== refreshToken) {
        return resolve(false);
      }

      const payload = { id, email, nickname };
      const newToken = signJWT(payload).token;
      resolve(newToken);
    });
  });
};

export const loginAuthenticate = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "local",
      { session: false },
      async (err: any, user: UserType, info: any) => {
        if (err) {
          reject(err);
        } else if (!user) {
          resolve({ message: info.message });
        } else {
          const { id, email, nickname } = user;
          const payload = { id, email, nickname };
          const { token, refreshToken } = signJWT(payload);
          await storeRefreshToken(id, refreshToken);
          resolve({ token, refreshToken });
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
