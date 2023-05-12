"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../DB"));
class Words {
    async createWords(user_id, folder_id, name) {
        const result = await DB_1.default.query("INSERT INTO Words (user_id, folder_id, name) VALUES (?, ?, ?)", [user_id, folder_id, name]);
        return result;
    }
    async getWords(folder_id) {
        const [result] = await DB_1.default.query(`SELECT Words.*, Users.nickname
      FROM Words 
      JOIN Folders ON Words.folder_id = Folders.id
      JOIN Users ON Folders.user_id = Users.id
      WHERE Words.folder_id = ?`, [folder_id]);
        return result;
    }
    async getRecentWords(user_id) {
        const [result] = await DB_1.default.query("SELECT * FROM Words WHERE user_id=? ORDER BY last_seen_time DESC", [user_id]);
        return result.slice(0, 10);
    }
    async getFavWords(user_id) {
        const [result] = await DB_1.default.query("SELECT * FROM Words WHERE is_favorite=1 AND user_id=?", [user_id]);
        return result;
    }
    async getSharedWords() {
        const [result] = await DB_1.default.query(`SELECT Words.*, Users.nickname 
    FROM Words 
    INNER JOIN Users ON Words.user_id = Users.id
    WHERE Words.is_shared = 1`);
        return result;
    }
    async renameWords(id, name) {
        const [result] = await DB_1.default.query("UPDATE Words SET name=? WHERE id=?", [
            name,
            id,
        ]);
        return result;
    }
    async deleteWords(id) {
        await DB_1.default.query("DELETE FROM WordData WHERE words_id = ?", [id]);
        const [result] = await DB_1.default.query("DELETE FROM Words WHERE id = ?", [id]);
        return result;
    }
    async moveWords(id, folder_id) {
        const [result] = await DB_1.default.query("UPDATE Words SET folder_id=? WHERE id=?", [folder_id, id]);
        return result;
    }
    async changeStatus(type, id, status) {
        const [result] = await DB_1.default.query(`UPDATE Words SET is_${type}=? WHERE id=?`, [status === 0 ? 1 : 0, id]);
        return result;
    }
    async getFolderIdFromWordsId(id) {
        const [result] = await DB_1.default.query("SELECT folder_id FROM Words WHERE id=?", [id]);
        return result;
    }
    async updateRecentView(id) {
        await DB_1.default.query("Update Words SET last_seen_time=CURRENT_TIMESTAMP WHERE id=?", [id]);
    }
}
exports.default = new Words();
