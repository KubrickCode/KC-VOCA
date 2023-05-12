import { Request, Response } from "express";
import { UserType } from "../models/Entity.type";
import {
  changeNicknameService,
  changePasswordService,
  deleteUserService,
  getUserService,
} from "../services/user.service";

export const getUser = async (req: Request, res: Response) => {
  const { id: user_id } = req.user as UserType;
  const { id, email, nickname, registration_date } = await getUserService(
    Number(user_id)
  );
  res.status(200).json({ id, email, nickname, registration_date });
};

export const changeNickname = async (req: Request, res: Response) => {
  const { nickname } = req.body;
  const { id } = req?.user as UserType;

  const result = await changeNicknameService(Number(id), nickname);
  if (result) {
    const { message } = result;
    res.status(403).json({ message });
  } else {
    res.status(204).send();
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { password, prevPassword } = req.body;
  const { id } = req?.user as UserType;

  const result = await changePasswordService(
    Number(id),
    password,
    prevPassword
  );
  if (result) {
    const { message } = result;
    res.status(403).json({ message });
  } else {
    res.status(204).send();
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req?.user as UserType;
  const { password } = req.body;
  const result = await deleteUserService(id, password);
  if (result) {
    res.status(204).send();
  } else {
    res.status(403).json({ message: "비밀번호를 확인해주세요" });
  }
};
