import { Request, Response } from "express";
import WordData from "../models/queries/WordData";

export const getWordData = async (req: Request, res: Response) => {
  const wordData = await WordData.getWordData(Number(req.params.id));
  res.json(wordData);
};

export const createWordData = async (req: Request, res: Response) => {
  const {
    user_id,
    folder_id,
    words_id,
    word,
    meaning,
    example_sentence,
    example_sentence_meaning,
  } = req.body;
  const result = await WordData.createWordData(
    user_id,
    folder_id,
    words_id,
    word,
    meaning,
    example_sentence,
    example_sentence_meaning
  );
  res.json({result});
};

export const updateWordData = async (req: Request, res: Response) => {
  const result = await WordData.updateWordData(Number(req.params.id), req.body);
  res.json(result);
};

export const deleteWordData = async (req: Request, res: Response) => {
  const result = await WordData.deleteWordData(Number(req.params.id));
  res.json(result);
};
