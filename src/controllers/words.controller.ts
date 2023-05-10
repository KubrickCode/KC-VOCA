import { Request, Response } from "express";
import Words from "../models/queries/Words";
import { UserType } from "src/models/types";

export const getWords = async (req: Request, res: Response) => {
  const { id: user_id } = req.user as UserType;
  if (req.params.id === "get_recent_file") {
    const words = await Words.getRecentWords(Number(user_id));
    res.json({ words });
  } else if (req.params.id === "get_fav_file") {
    const words = await Words.getFavWords(Number(user_id));
    res.json({ words });
  } else {
    const words = await Words.getWords(Number(req.params.id));
    res.json({ words });
  }
};

export const createWords = async (req: Request, res: Response) => {
  const { id } = req.user as UserType;
  const { folder_id, name } = req.body;
  const result = await Words.createWords(id, folder_id, name);
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
