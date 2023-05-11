import { Request, Response } from "express";
import WordData from "../models/queries/WordData";
import { UserType } from "src/models/types";
import Words from "../models/queries/Words";
import { playSound } from "../integrations/playSound";

export const getWordData = async (req: Request, res: Response) => {
  const wordData = await WordData.getWordData(Number(req.params.id));
  res.json(wordData);
};

export const createWordData = async (req: Request, res: Response) => {
  const {
    words_id,
    word,
    meaning,
    example_sentence,
    example_sentence_meaning,
  } = req.body;
  const { id: user_id } = req.user as UserType;
  const [folder_id] = await Words.getFolderIdFromWordsId(words_id);

  const result = await WordData.createWordData(
    user_id,
    folder_id.folder_id,
    words_id,
    word,
    meaning,
    example_sentence,
    example_sentence_meaning
  );
  res.json({ result });
};

export const updateWordData = async (req: Request, res: Response) => {
  const result = await WordData.updateWordData(Number(req.params.id), req.body);
  res.json(result);
};

export const deleteWordData = async (req: Request, res: Response) => {
  const result = await WordData.deleteWordData(Number(req.params.id));
  res.json(result);
};

export const ttsService = async (req: Request, res: Response) => {
  const result = await playSound(req.body.text);
  res.send(result);
};

export const search = async (req: Request, res: Response) => {
  const { id } = req.user as UserType;
  const { keyword } = req.body;
  const result = await WordData.searchData(id, keyword);
  res.json(result);
};
