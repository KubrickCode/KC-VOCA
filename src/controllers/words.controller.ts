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
  } else if (req.params.id === "get_shared_file") {
    const words = await Words.getSharedWords();
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

export const moveWords = async (req: Request, res: Response) => {
  const { id, folder_id } = req.query;
  const result = await Words.moveWords(Number(id), Number(folder_id));
  res.json(result);
};

export const changeStats = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_favorite, is_shared } = req.body;
  let message;
  if (is_favorite !== undefined) {
    await Words.changeStatus("favorite", Number(id), is_favorite);
    message =
      is_favorite === 0
        ? "즐겨찾기에 등록되었습니다"
        : "즐겨찾기에서 해제되었습니다";
  } else if (is_shared !== undefined) {
    await Words.changeStatus("shared", Number(id), is_shared);
    message =
      is_shared === 0
        ? "단어장이 공유되었습니다"
        : "단어장이 공유해제되었습니다";
  }

  res.json({ message });
};

export const updateRecentView = async (req: Request, res: Response) => {
  await Words.updateRecentView(Number(req.params.id));
};
