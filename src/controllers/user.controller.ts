import { Request, Response } from "express";
import User from "../models/queries/User";
import { UserType } from "./../models/types";

export const getUser = async (req: Request, res: Response) => {
  const { id: user_id } = req.user as UserType;
  const [user] = await User.getUserById(Number(user_id));
  const { id, email, nickname, registration_date } = user;
  res.json({ id, email, nickname, registration_date });
};

export const updateUser = async (req: Request, res: Response) => {
  const { nickname, password, prevPassword } = req.body;
  const { id } = req?.user as UserType;

  if (nickname) {
    const result = await User.checkNickname(nickname);
    if (result) {
      await User.updateUser(Number(id), nickname, "nickname");
    } else {
      res.status(403).json({ message: "이미 존재하는 닉네임입니다" });
      return;
    }
  }
  if (password) {
    const result = await User.checkPassword(id, prevPassword);
    if (result) {
      await User.updateUser(Number(id), password, "password");
    } else {
      res.status(403).json({ message: "기존 비밀번호를 확인해주세요" });
      return;
    }
  }
  res.json(true);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req?.user as UserType;
  const { password } = req.body;
  const result = await User.checkPassword(id, password);
  if (result) {
    await User.deleteUser(id);
    res.json(true);
  } else {
    res.status(403).json({ message: "비밀번호를 확인해주세요" });
  }
};
