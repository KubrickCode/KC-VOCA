import { NextFunction, Request, Response } from "express";
import {
  googleAuthenticate,
  googleCallbackAuthenticate,
  kakaoAuthenticate,
  kakaoCallbackAuthenticate,
} from "../integrations/handleLogin";
import { UserType } from "../models/Entity.type";
import dotenv from "dotenv";
import {
  addUserService,
  loginService,
  refreshTokenService,
} from "../services/auth.service";
import { findPasswordService } from "./../services/auth.service";
dotenv.config();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginService(email, password);
  res.status(201).json({ result });
};

export const refreshToken = async (req: Request, res: Response) => {
  const newToken = await refreshTokenService(
    req.headers["x-refresh-token"] as string
  );
  if (!newToken) {
    return res.status(401).json({ message: "리프레쉬 토큰이 만료되었습니다" });
  }
  res.json({ token: newToken });
};

export const addUser = async (req: Request, res: Response) => {
  const { email, nickname, password } = req.body;
  const token = await addUserService(email, nickname, password);
  res.status(201).json({ token });
};

export const findPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await findPasswordService(email);

  if (!result) {
    res.status(404).json({ message: "존재하지 않는 계정입니다" });
  } else {
    res.status(204).send();
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
  const { token, refreshToken } = (await googleCallbackAuthenticate(
    req,
    res,
    next
  )) as UserType;
  res
    .status(303)
    .redirect(
      `${process.env.REDIRECT_ROOT}/authorize?token=${token}&refreshToken=${refreshToken}`
    );
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
  const { token, refreshToken } = (await kakaoCallbackAuthenticate(
    req,
    res,
    next
  )) as UserType;
  res
    .status(303)
    .redirect(
      `${process.env.REDIRECT_ROOT}/authorize?token=${token}&refreshToken=${refreshToken}`
    );
};
