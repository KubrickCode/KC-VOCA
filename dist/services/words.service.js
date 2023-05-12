"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecentViewService = exports.changeStatusService = exports.moveWordsService = exports.deleteWordsService = exports.renameWordsService = exports.createWordsService = exports.getWordsService = void 0;
const Words_1 = __importDefault(require("../models/queries/Words"));
const getWordsService = async (user_id, id) => {
    if (id === "get_recent_file") {
        const words = await Words_1.default.getRecentWords(user_id);
        return { words };
    }
    else if (id === "get_fav_file") {
        const words = await Words_1.default.getFavWords(user_id);
        return { words };
    }
    else if (id === "get_shared_file") {
        const words = await Words_1.default.getSharedWords();
        return { words };
    }
    else {
        const words = await Words_1.default.getWords(Number(id));
        return { words };
    }
};
exports.getWordsService = getWordsService;
const createWordsService = async (id, folder_id, name) => {
    await Words_1.default.createWords(id, folder_id, name);
};
exports.createWordsService = createWordsService;
const renameWordsService = async (id, name) => {
    await Words_1.default.renameWords(id, name);
};
exports.renameWordsService = renameWordsService;
const deleteWordsService = async (id) => {
    await Words_1.default.deleteWords(id);
};
exports.deleteWordsService = deleteWordsService;
const moveWordsService = async (id, folder_id) => {
    await Words_1.default.moveWords(id, folder_id);
};
exports.moveWordsService = moveWordsService;
const changeStatusService = async (id, is_favorite, is_shared) => {
    let message;
    if (is_favorite !== undefined) {
        await Words_1.default.changeStatus("favorite", id, is_favorite);
        message =
            is_favorite === 0
                ? "즐겨찾기에 등록되었습니다"
                : "즐겨찾기에서 해제되었습니다";
    }
    else if (is_shared !== undefined) {
        await Words_1.default.changeStatus("shared", id, is_shared);
        message =
            is_shared === 0
                ? "단어장이 공유되었습니다"
                : "단어장이 공유해제되었습니다";
    }
    return message;
};
exports.changeStatusService = changeStatusService;
const updateRecentViewService = async (id) => {
    await Words_1.default.updateRecentView(id);
};
exports.updateRecentViewService = updateRecentViewService;
