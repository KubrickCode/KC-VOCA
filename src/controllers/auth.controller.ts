import { Request, Response } from "express";
import { loginAuthenticate } from "../integrations/handleLogin";
import User from "../models/queries/User";
import { hashPassword } from "../integrations/handlePassword";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await loginAuthenticate(email, password);
  res.json({ token });
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
