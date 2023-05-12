import { Request, Response } from "express";
import Words from "../models/queries/Words";
import { UserType } from "src/models/types";
import {
  changeStatsService,
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
  res.json(result);
};

export const createWords = async (req: Request, res: Response) => {
  const { id } = req.user as UserType;
  const { folder_id, name } = req.body;
  await createWordsService(id, folder_id, name);
  res.json(true);
};

export const renameWords = async (req: Request, res: Response) => {
  await renameWordsService(Number(req.params.id), req.body.name);
  res.json(true);
};

export const deleteWords = async (req: Request, res: Response) => {
  await deleteWordsService(Number(req.params.id));
  res.json(true);
};

export const moveWords = async (req: Request, res: Response) => {
  const { id, folder_id } = req.query;
  await moveWordsService(Number(id), Number(folder_id));
  res.json(true);
};

export const changeStats = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_favorite, is_shared } = req.body;
  const message = await changeStatsService(Number(id), is_favorite, is_shared);
  res.json({ message });
};

export const updateRecentView = async (req: Request) => {
  await updateRecentViewService(Number(req.params.id));
};
