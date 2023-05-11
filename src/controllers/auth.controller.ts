import { Request, Response } from "express";
import { loginAuthenticate } from "../integrations/handleLogin";
import User from "../models/queries/User";
import { hashPassword } from "../integrations/handlePassword";
import { getRandomPassword } from "../integrations/getRandomPassword";
import { mailService } from "../integrations/mailService";

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
