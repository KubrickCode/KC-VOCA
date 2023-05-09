import { Request, Response } from "express";
import User from "../models/queries/User";
import { UserType } from "./../models/types";

export const getUser = async (req: Request, res: Response) => {
  const user = await User.getUserById(Number(req.params.id));
  res.json(user);
};

export const addUser = async (req: Request, res: Response) => {
  const newUser = await User.createUser(req.body);
  res.json(newUser);
};

export const updateUser = async (req: Request, res: Response) => {
  const { email, nickname, password } = req.body;
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
