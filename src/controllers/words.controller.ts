import { Request, Response } from "express";
import Words from "../models/queries/Words";

export const getWords = async (req: Request, res: Response) => {
  const words = await Words.getWords(Number(req.params.id));
  res.json(words);
};

export const createWords = async (req: Request, res: Response) => {
  const { user_id, folder_id, name } = req.body;
  const result = await Words.createWords(user_id, folder_id, name);
  res.json(result);
};

export const renameWords = async (req: Request, res: Response) => {
  const result = await Words.renameWords(Number(req.params.id), req.body.name);
  res.json(result);
};

export const deleteWords = async (req: Request, res: Response) => {
  const result = await Words.deleteWords(Number(req.params.id));
  res.json(result);
};
