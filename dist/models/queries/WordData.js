"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../DB"));
class WordData {
    async createWordData(user_id, folder_id, words_id, word, meaning, example_sentence, example_sentence_meaning) {
        const result = await DB_1.default.query("INSERT INTO worddata (user_id, folder_id, words_id,word,meaning,example_sentence,example_sentence_meaning) VALUES (?, ?, ?,?,?,?,?)", [
            user_id,
            folder_id,
            words_id,
            word,
            meaning,
            example_sentence,
            example_sentence_meaning,
        ]);
        return result;
    }
    async getWordData(words_id) {
        const [userResult] = await DB_1.default.query("SELECT name FROM words WHERE id = ?", [words_id]);
        const [wordDataResult] = await DB_1.default.query("SELECT * FROM worddata WHERE words_id = ?", [words_id]);
        const result = {
            name: userResult[0].name,
            user_id: userResult[0].user_id,
            wordData: wordDataResult,
        };
        return result;
    }
    async updateWordData(id, data) {
        const query = `UPDATE worddata SET word = ?, meaning = ?, example_sentence = ? , example_sentence_meaning = ? WHERE id = ?`;
        const params = [
            data.word,
            data.meaning,
            data.example_sentence,
            data.example_sentence_meaning,
            id,
        ];
        const [result] = await DB_1.default.query(query, params);
        return result;
    }
    async deleteWordData(id) {
        const [result] = await DB_1.default.query("DELETE FROM worddata WHERE id = ?", [
            id,
        ]);
        return result;
    }
    async searchData(id, keyword) {
        const [result] = await DB_1.default.query("SELECT * FROM worddata WHERE word REGEXP ? AND worddata.user_id=? OR meaning REGEXP ? AND worddata.user_id=?", [keyword, id, keyword, id]);
        return result;
    }
    async updateComplete(id, is_complete) {
        await DB_1.default.query("UPDATE worddata SET is_complete=? WHERE id=?", [
            is_complete === 0 ? 1 : 0,
            id,
        ]);
    }
}
exports.default = new WordData();
