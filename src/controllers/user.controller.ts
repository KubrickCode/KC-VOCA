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
  const { nickname, password } = req.body;
  const { id } = req.params;

  const fieldsToUpdate: Partial<UserType> = {};

  if (nickname) {
    fieldsToUpdate.nickname = nickname;
  }
  if (password) {
    fieldsToUpdate.password = password;
  }
  const result = await User.updateUser(Number(id), fieldsToUpdate);
  res.json(result);
};

export const deleteUser = async (req: Request, res: Response) => {
  await User.deleteUser(Number(req.params.id));
  res.json({ message: "User deleted" });
};
