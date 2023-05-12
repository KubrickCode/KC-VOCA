"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComplete = exports.search = exports.ttsService = exports.deleteWordData = exports.updateWordData = exports.createWordData = exports.getWordData = void 0;
const wordData_service_1 = require("../services/wordData.service");
const getWordData = async (req, res) => {
    const wordData = await (0, wordData_service_1.getWordDataService)(Number(req.params.id));
    res.status(200).json(wordData);
};
exports.getWordData = getWordData;
const createWordData = async (req, res) => {
    const { words_id, word, meaning, example_sentence, example_sentence_meaning, } = req.body;
    const { id: user_id } = req.user;
    await (0, wordData_service_1.createWordDataService)(user_id, words_id, word, meaning, example_sentence, example_sentence_meaning);
    res.status(204).send();
};
exports.createWordData = createWordData;
const updateWordData = async (req, res) => {
    await (0, wordData_service_1.updateWordDataService)(Number(req.params.id), req.body);
    res.status(204).send();
};
exports.updateWordData = updateWordData;
const deleteWordData = async (req, res) => {
    await (0, wordData_service_1.deleteWordDataService)(Number(req.params.id));
    res.status(204).send();
};
exports.deleteWordData = deleteWordData;
const ttsService = async (req, res) => {
    const result = await (0, wordData_service_1.ttsServiceService)(req.body.text);
    res.status(201).send(result);
};
exports.ttsService = ttsService;
const search = async (req, res) => {
    const { id } = req.user;
    const { keyword } = req.body;
    const result = await (0, wordData_service_1.searchService)(id, keyword);
    res.status(200).json(result);
};
exports.search = search;
const updateComplete = async (req, res) => {
    const { id, is_complete } = req.body;
    await (0, wordData_service_1.updateCompleteService)(id, is_complete);
    res.status(204).send();
};
exports.updateComplete = updateComplete;
