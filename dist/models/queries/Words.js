"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../DB"));
class Words {
    async createWords(user_id, folder_id, name) {
        const result = await DB_1.default.query("INSERT INTO words (user_id, folder_id, name) VALUES (?, ?, ?)", [user_id, folder_id, name]);
        return result;
    }
    async getWords(folder_id) {
        const [result] = await DB_1.default.query(`SELECT words.*, users.nickname
      FROM words 
      JOIN folders ON words.folder_id = folders.id
      JOIN users ON folders.user_id = users.id
      WHERE words.folder_id = ?`, [folder_id]);
        return result;
    }
    async getRecentWords(user_id) {
        const [result] = await DB_1.default.query("SELECT * FROM words WHERE user_id=? ORDER BY last_seen_time DESC", [user_id]);
        return result.slice(0, 10);
    }
    async getFavWords(user_id) {
        const [result] = await DB_1.default.query("SELECT * FROM words WHERE is_favorite=1 AND user_id=?", [user_id]);
        return result;
    }
    async getSharedWords() {
        const [result] = await DB_1.default.query(`SELECT words.*, users.nickname 
    FROM words 
    INNER JOIN users ON words.user_id = users.id
    WHERE words.is_shared = 1`);
        return result;
    }
    async renameWords(id, name) {
        const [result] = await DB_1.default.query("UPDATE words SET name=? WHERE id=?", [
            name,
            id,
        ]);
        return result;
    }
    async deleteWords(id) {
        await DB_1.default.query("DELETE FROM worddata WHERE words_id = ?", [id]);
        const [result] = await DB_1.default.query("DELETE FROM words WHERE id = ?", [id]);
        return result;
    }
    async moveWords(id, folder_id) {
        const [result] = await DB_1.default.query("UPDATE words SET folder_id=? WHERE id=?", [folder_id, id]);
        return result;
    }
    async changeStatus(type, id, status) {
        const [result] = await DB_1.default.query(`UPDATE words SET is_${type}=? WHERE id=?`, [status === 0 ? 1 : 0, id]);
        return result;
    }
    async getFolderIdFromWordsId(id) {
        const [result] = await DB_1.default.query("SELECT folder_id FROM words WHERE id=?", [id]);
        return result;
    }
    async updateRecentView(id) {
        await DB_1.default.query("Update words SET last_seen_time=CURRENT_TIMESTAMP WHERE id=?", [id]);
    }
}
exports.default = new Words();
