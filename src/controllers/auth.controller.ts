import { NextFunction, Request, Response } from "express";
import {
  googleAuthenticate,
  googleCallbackAuthenticate,
  kakaoAuthenticate,
  kakaoCallbackAuthenticate,
  loginAuthenticate,
  signJWT,
} from "../integrations/handleLogin";
import User from "../models/queries/User";
import { hashPassword } from "../integrations/handlePassword";
import { getRandomPassword } from "../integrations/getRandomPassword";
import { mailService } from "../integrations/mailService";
import { UserType } from "../models/types";
import dotenv from "dotenv";
dotenv.config();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginAuthenticate(email, password);
  res.json({ result });
};

export const addUser = async (req: Request, res: Response) => {
  const { email, nickname, password } = req.body;
  const hashedPassword = await hashPassword(password);
  await User.createUser({
    email,
    nickname,
    password: hashedPassword,
  });
  const token = await loginAuthenticate(email, password);
  res.json({ token });
};

export const findPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const userInfo = await User.getUserByEmail(email);
  if (!userInfo) {
    res.status(404).json({ message: "존재하지 않는 계정입니다" });
  } else {
    const randomPassword = getRandomPassword();
    await User.updateUser(userInfo.id, randomPassword, "password");
    await mailService(email, randomPassword);
    res.json(true);
  }
};

export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  googleAuthenticate()(req, res, next);
};

export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = (await googleCallbackAuthenticate(
    req,
    res,
    next
  )) as UserType;
  res.redirect(`${process.env.REDIRECT_ROOT}/authorize?token=${token}`);
};

export const kakaoLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  kakaoAuthenticate()(req, res, next);
};

export const kakaoCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = (await kakaoCallbackAuthenticate(
    req,
    res,
    next
  )) as UserType;
  res.redirect(`${process.env.REDIRECT_ROOT}/authorize?token=${token}`);
};
