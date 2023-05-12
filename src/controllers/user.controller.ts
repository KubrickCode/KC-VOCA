import { Request, Response } from "express";
import { UserType } from "../models/types";
import {
  deleteUserService,
  getUserService,
  updateUserService,
} from "../services/user.service";

export const getUser = async (req: Request, res: Response) => {
  const { id: user_id } = req.user as UserType;
  const { id, email, nickname, registration_date } = await getUserService(
    Number(user_id)
  );
  res.json({ id, email, nickname, registration_date });
};

export const updateUser = async (req: Request, res: Response) => {
  const { nickname, password, prevPassword } = req.body;
  const { id } = req?.user as UserType;

  const result = await updateUserService(
    Number(id),
    nickname,
    password,
    prevPassword
  );
  if (result) {
    const { message } = result;
    res.status(403).json({ message });
  } else {
    res.json(true);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req?.user as UserType;
  const { password } = req.body;
  const result = await deleteUserService(id, password);
  if (result) {
    res.json(true);
  } else {
    res.status(403).json({ message: "비밀번호를 확인해주세요" });
  }
};
