import { Request, Response } from "express";
import { UserType } from "src/models/Entity.type";
import {
  createWordDataService,
  deleteWordDataService,
  getWordDataService,
  searchService,
  ttsServiceService,
  updateWordDataService,
} from "../services/wordData.service";

export const getWordData = async (req: Request, res: Response) => {
  const wordData = await getWordDataService(Number(req.params.id));
  res.status(200).json(wordData);
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
  await createWordDataService(
    user_id,
    words_id,
    word,
    meaning,
    example_sentence,
    example_sentence_meaning
  );
  res.status(204).send();
};

export const updateWordData = async (req: Request, res: Response) => {
  await updateWordDataService(Number(req.params.id), req.body);
  res.status(204).send();
};

export const deleteWordData = async (req: Request, res: Response) => {
  await deleteWordDataService(Number(req.params.id));
  res.status(204).send();
};

export const ttsService = async (req: Request, res: Response) => {
  const result = await ttsServiceService(req.body.text);
  res.status(201).send(result);
};

export const search = async (req: Request, res: Response) => {
  const { id } = req.user as UserType;
  const { keyword } = req.body;
  const result = await searchService(id, keyword);
  res.status(200).json(result);
};
