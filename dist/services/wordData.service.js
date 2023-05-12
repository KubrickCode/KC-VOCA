"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompleteService = exports.searchService = exports.ttsServiceService = exports.deleteWordDataService = exports.updateWordDataService = exports.createWordDataService = exports.getWordDataService = void 0;
const Words_1 = __importDefault(require("../models/queries/Words"));
const WordData_1 = __importDefault(require("../models/queries/WordData"));
const playSound_1 = require("../integrations/playSound");
const getWordDataService = async (id) => {
    return await WordData_1.default.getWordData(id);
};
exports.getWordDataService = getWordDataService;
const createWordDataService = async (user_id, words_id, word, meaning, example_sentence, example_sentence_meaning) => {
    const [folder_id] = await Words_1.default.getFolderIdFromWordsId(words_id);
    await WordData_1.default.createWordData(user_id, folder_id.folder_id, words_id, word, meaning, example_sentence, example_sentence_meaning);
};
exports.createWordDataService = createWordDataService;
const updateWordDataService = async (id, body) => {
    await WordData_1.default.updateWordData(id, body);
};
exports.updateWordDataService = updateWordDataService;
const deleteWordDataService = async (id) => {
    await WordData_1.default.deleteWordData(id);
};
exports.deleteWordDataService = deleteWordDataService;
const ttsServiceService = async (text) => {
    return await (0, playSound_1.playSound)(text);
};
exports.ttsServiceService = ttsServiceService;
const searchService = async (id, keyword) => {
    return await WordData_1.default.searchData(id, keyword);
};
exports.searchService = searchService;
const updateCompleteService = async (id, is_complete) => {
    return await WordData_1.default.updateComplete(id, is_complete);
};
exports.updateCompleteService = updateCompleteService;
