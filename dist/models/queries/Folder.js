"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../DB"));
class Folder {
    async createFolder(user_id, parent_id, name) {
        const result = await DB_1.default.query("INSERT INTO folders (user_id, parent_id, name) VALUES (?, ?, ?)", [user_id, parent_id, name]);
        return result;
    }
    async getFolders(user_id) {
        const [result] = await DB_1.default.query("SELECT * FROM folders WHERE user_id = ?", [user_id]);
        return result;
    }
    async renameFolder(id, name) {
        const [result] = await DB_1.default.query("UPDATE folders SET name=? WHERE id=?", [
            name,
            id,
        ]);
        return result;
    }
    async deleteFolder(id) {
        await DB_1.default.query("DELETE FROM worddata WHERE folder_id = ?", [id]);
        await DB_1.default.query("DELETE FROM words WHERE folder_id = ?", [id]);
        const [result] = await DB_1.default.query("DELETE FROM folders WHERE id = ?", [id]);
        return result;
    }
    async getChildFolders(id) {
        const [rows] = await DB_1.default.query("SELECT id FROM folders WHERE parent_id = ?", [id]);
        const children = rows.map((row) => row.id);
        for (const childId of children) {
            const grandChildren = await this.getChildFolders(childId);
            children.push(...grandChildren);
        }
        return children;
    }
    async moveFolder(id, parent_id) {
        const childFolderIds = await this.getChildFolders(id);
        if (childFolderIds.includes(parent_id)) {
            return false;
        }
        await DB_1.default.query("UPDATE folders SET parent_id=? WHERE id=?", [
            parent_id,
            id,
        ]);
        return true;
    }
}
exports.default = new Folder();
