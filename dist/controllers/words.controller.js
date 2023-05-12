"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecentView = exports.changeStatus = exports.moveWords = exports.deleteWords = exports.renameWords = exports.createWords = exports.getWords = void 0;
const words_service_1 = require("../services/words.service");
const getWords = async (req, res) => {
    const { id: user_id } = req.user;
    const result = await (0, words_service_1.getWordsService)(user_id, req.params.id);
    res.status(200).json(result);
};
exports.getWords = getWords;
const createWords = async (req, res) => {
    const { id } = req.user;
    const { folder_id, name } = req.body;
    await (0, words_service_1.createWordsService)(id, folder_id, name);
    res.status(204).send();
};
exports.createWords = createWords;
const renameWords = async (req, res) => {
    await (0, words_service_1.renameWordsService)(Number(req.params.id), req.body.name);
    res.status(204).send();
};
exports.renameWords = renameWords;
const deleteWords = async (req, res) => {
    await (0, words_service_1.deleteWordsService)(Number(req.params.id));
    res.status(204).send();
};
exports.deleteWords = deleteWords;
const moveWords = async (req, res) => {
    const { id, folder_id } = req.query;
    await (0, words_service_1.moveWordsService)(Number(id), Number(folder_id));
    res.status(204).send();
};
exports.moveWords = moveWords;
const changeStatus = async (req, res) => {
    const { id } = req.params;
    const { is_favorite, is_shared } = req.body;
    const message = await (0, words_service_1.changeStatusService)(Number(id), is_favorite, is_shared);
    res.status(201).json({ message });
};
exports.changeStatus = changeStatus;
const updateRecentView = async (req, res) => {
    await (0, words_service_1.updateRecentViewService)(Number(req.params.id));
    res.status(204).send();
};
exports.updateRecentView = updateRecentView;
