import { Request, Response } from "express";
import { UserType } from "src/models/Entity.type";
import {
  changeStatusService,
  createWordsService,
  deleteWordsService,
  getWordsService,
  moveWordsService,
  renameWordsService,
  updateRecentViewService,
} from "../services/words.service";

export const getWords = async (req: Request, res: Response) => {
  const { id: user_id } = req.user as UserType;
  const result = await getWordsService(user_id, req.params.id);
  res.status(200).json(result);
};

export const createWords = async (req: Request, res: Response) => {
  const { id } = req.user as UserType;
  const { folder_id, name } = req.body;
  await createWordsService(id, folder_id, name);
  res.status(204).send();
};

export const renameWords = async (req: Request, res: Response) => {
  await renameWordsService(Number(req.params.id), req.body.name);
  res.status(204).send();
};

export const deleteWords = async (req: Request, res: Response) => {
  await deleteWordsService(Number(req.params.id));
  res.status(204).send();
};

export const moveWords = async (req: Request, res: Response) => {
  const { id, folder_id } = req.query;
  await moveWordsService(Number(id), Number(folder_id));
  res.status(204).send();
};

export const changeStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_favorite, is_shared } = req.body;
  const message = await changeStatusService(Number(id), is_favorite, is_shared);
  res.status(201).json({ message });
};

export const updateRecentView = async (req: Request, res: Response) => {
  await updateRecentViewService(Number(req.params.id));
  res.status(204).send();
};
