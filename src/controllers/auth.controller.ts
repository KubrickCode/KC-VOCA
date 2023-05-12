import { NextFunction, Request, Response } from "express";
import {
  googleAuthenticate,
  googleCallbackAuthenticate,
  kakaoAuthenticate,
  kakaoCallbackAuthenticate,
} from "../integrations/handleLogin";
import { UserType } from "../models/types";
import dotenv from "dotenv";
import { addUserService, loginService } from "../services/auth.service";
import { findPasswordService } from "./../services/auth.service";
dotenv.config();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginService(email, password);
  res.json({ result });
};

export const addUser = async (req: Request, res: Response) => {
  const { email, nickname, password } = req.body;
  const token = await addUserService(email, nickname, password);
  res.json({ token });
};

export const findPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await findPasswordService(email);

  if (!result) {
    res.status(404).json({ message: "존재하지 않는 계정입니다" });
  } else {
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
