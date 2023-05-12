import pool from "../DB";
import { UserType } from "../Entity.type";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import Folder from "./Folder";
import {
  comparePassword,
  hashPassword,
} from "../../integrations/handlePassword";

class User {
  async getUserById(id: number) {
    const rows = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Users WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  async getUserByEmail(email: string): Promise<UserType> {
    const rows = await pool.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);
    const row = rows[0] as RowDataPacket;

    return row[0];
  }

  async createUser(user: {
    email: string;
    nickname: string;
    password: string;
  }) {
    const { email, nickname, password } = user;
    const [checkEmail] = await pool.query<RowDataPacket[]>(
      "SELECT email FROM Users WHERE email = ?",
      [email]
    );
    const [checkNickname] = await pool.query<RowDataPacket[]>(
      "SELECT nickname FROM Users WHERE nickname = ?",
      [nickname]
    );
    if (checkEmail.length > 0) {
      return "이미 존재하는 이메일 입니다.";
    }
    if (checkNickname.length > 0) {
      return "이미 존재하는 닉네임 입니다.";
    }
    const [userData] = await pool.query(
      "INSERT INTO Users (email, nickname, password) VALUES (?, ?, ?)",
      [email, nickname, password]
    );
    const { insertId } = userData as ResultSetHeader;
    const result = await Folder.createFolder(insertId, 0, "Home");
    return result;
  }

  async changeNickname(id: number, value: string) {
    await pool.query(`UPDATE Users SET nickname=? WHERE id = ?`, [value, id]);
  }

  async changePassword(id: number, value: string) {
    const hashedPassword = await hashPassword(value);
    await pool.query(`UPDATE Users SET password=? WHERE id = ?`, [
      hashedPassword,
      id,
    ]);
  }

  async deleteUser(id: number) {
    await pool.query("DELETE FROM WordData WHERE user_id = ?", [id]);
    await pool.query("DELETE FROM Words WHERE user_id = ?", [id]);
    await pool.query("DELETE FROM Folders WHERE user_id = ?", [id]);
    await pool.query("DELETE FROM Users WHERE id = ?", [id]);
  }

  async checkPassword(id: number, password: string) {
    const [result] = await pool.query<RowDataPacket[]>(
      "SELECT password FROM Users WHERE id = ?",
      [id]
    );
    const hashedPassword = result[0].password;
    return await comparePassword(password, hashedPassword);
  }

  async checkNickname(nickname: string) {
    const [result] = await pool.query<RowDataPacket[]>(
      "SELECT nickname FROM Users WHERE nickname = ?",
      [nickname]
    );
    return result.length === 0;
  }
}

export default new User();
