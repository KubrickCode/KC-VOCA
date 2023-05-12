import Words from "../models/queries/Words";

export const getWordsService = async (user_id: number, id: string) => {
  if (id === "get_recent_file") {
    const words = await Words.getRecentWords(user_id);
    return { words };
  } else if (id === "get_fav_file") {
    const words = await Words.getFavWords(user_id);
    return { words };
  } else if (id === "get_shared_file") {
    const words = await Words.getSharedWords();
    return { words };
  } else {
    const words = await Words.getWords(Number(id));
    return { words };
  }
};

export const createWordsService = async (
  id: number,
  folder_id: number,
  name: string
) => {
  await Words.createWords(id, folder_id, name);
};

export const renameWordsService = async (id: number, name: string) => {
  await Words.renameWords(id, name);
};

export const deleteWordsService = async (id: number) => {
  await Words.deleteWords(id);
};

export const moveWordsService = async (id: number, folder_id: number) => {
  await Words.moveWords(id, folder_id);
};

export const changeStatsService = async (
  id: number,
  is_favorite: WordsStatus,
  is_shared: WordsStatus
) => {
  let message;
  if (is_favorite !== undefined) {
    await Words.changeStatus("favorite", id, is_favorite);
    message =
      is_favorite === 0
        ? "즐겨찾기에 등록되었습니다"
        : "즐겨찾기에서 해제되었습니다";
  } else if (is_shared !== undefined) {
    await Words.changeStatus("shared", id, is_shared);
    message =
      is_shared === 0
        ? "단어장이 공유되었습니다"
        : "단어장이 공유해제되었습니다";
  }
  return message;
};

export const updateRecentViewService = async (id: number) => {
  await Words.updateRecentView(id);
};

type WordsStatus = undefined | 0 | 1;
