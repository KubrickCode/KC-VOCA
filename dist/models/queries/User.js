"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../DB"));
const Folder_1 = __importDefault(require("./Folder"));
const handlePassword_1 = require("../../integrations/handlePassword");
class User {
    async getUserById(id) {
        const rows = await DB_1.default.query("SELECT * FROM users WHERE id = ?", [id]);
        return rows[0];
    }
    async getUserByEmail(email) {
        const rows = await DB_1.default.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        const row = rows[0];
        return row[0];
    }
    async createUser(user) {
        const { email, nickname, password } = user;
        const [checkEmail] = await DB_1.default.query("SELECT email FROM users WHERE email = ?", [email]);
        const [checkNickname] = await DB_1.default.query("SELECT nickname FROM users WHERE nickname = ?", [nickname]);
        if (checkEmail.length > 0) {
            return "이미 존재하는 이메일 입니다.";
        }
        if (checkNickname.length > 0) {
            return "이미 존재하는 닉네임 입니다.";
        }
        const [userData] = await DB_1.default.query("INSERT INTO users (email, nickname, password) VALUES (?, ?, ?)", [email, nickname, password]);
        const { insertId } = userData;
        const result = await Folder_1.default.createFolder(insertId, 0, "Home");
        return result;
    }
    async changeNickname(id, value) {
        await DB_1.default.query(`UPDATE users SET nickname=? WHERE id = ?`, [value, id]);
    }
    async changePassword(id, value) {
        const hashedPassword = await (0, handlePassword_1.hashPassword)(value);
        await DB_1.default.query(`UPDATE users SET password=? WHERE id = ?`, [
            hashedPassword,
            id,
        ]);
    }
    async deleteUser(id) {
        await DB_1.default.query("DELETE FROM worddata WHERE user_id = ?", [id]);
        await DB_1.default.query("DELETE FROM words WHERE user_id = ?", [id]);
        await DB_1.default.query("DELETE FROM folders WHERE user_id = ?", [id]);
        await DB_1.default.query("DELETE FROM users WHERE id = ?", [id]);
    }
    async checkPassword(id, password) {
        const [result] = await DB_1.default.query("SELECT password FROM users WHERE id = ?", [id]);
        const hashedPassword = result[0].password;
        return await (0, handlePassword_1.comparePassword)(password, hashedPassword);
    }
    async checkNickname(nickname) {
        const [result] = await DB_1.default.query("SELECT nickname FROM users WHERE nickname = ?", [nickname]);
        return result.length === 0;
    }
}
exports.default = new User();
