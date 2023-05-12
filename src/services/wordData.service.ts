import Words from "../models/queries/Words";
import WordData from "../models/queries/WordData";
import { WordDataType } from "../models/Entity.type";
import { playSound } from "../integrations/playSound";

export const getWordDataService = async (id: number) => {
  return await WordData.getWordData(id);
};

export const createWordDataService = async (
  user_id: number,
  words_id: number,
  word: string,
  meaning: string,
  example_sentence: string,
  example_sentence_meaning: string
) => {
  const [folder_id] = await Words.getFolderIdFromWordsId(words_id);

  await WordData.createWordData(
    user_id,
    folder_id.folder_id,
    words_id,
    word,
    meaning,
    example_sentence,
    example_sentence_meaning
  );
};

export const updateWordDataService = async (
  id: number,
  body: Partial<WordDataType>
) => {
  await WordData.updateWordData(id, body);
};

export const deleteWordDataService = async (id: number) => {
  await WordData.deleteWordData(id);
};

export const ttsServiceService = async (text: string) => {
  return await playSound(text);
};

export const searchService = async (id: number, keyword: string) => {
  return await WordData.searchData(id, keyword);
};

export const updateCompleteService = async (
  id: number,
  is_complete: number
) => {
  return await WordData.updateComplete(id, is_complete);
};
