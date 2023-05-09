import pool from "../db";
import { UserType } from "../types";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import Folder from "./Folder";

class User {
  async getUserById(id: number) {
    const rows = await pool.query("SELECT * FROM Users WHERE id = ?", [id]);
    return rows[0];
  }

  async getUserByEmail(email: string): Promise<UserType> {
    const rows = await pool.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);
    const row = rows[0] as RowDataPacket;

    const user: UserType = {
      id: row[0].id,
      email: row[0].email,
      nickname: row[0].nickname,
      password: row[0].password,
      registration_date: row[0].registration_date,
    };
    return user;
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

  async updateUser(id: number, fieldsToUpdate: Partial<UserType>) {
    const setClause = Object.keys(fieldsToUpdate)
      .map((field) => `${field} = ?`)
      .join(", ");

    const query = `UPDATE Users SET ${setClause} WHERE id = ?`;

    const [rows] = await pool.query(query, [
      ...Object.values(fieldsToUpdate),
      id,
    ]);

    return rows;
  }

  async deleteUser(id: number) {
    const [result] = await pool.query("DELETE FROM Users WHERE id = ?", [id]);
    return result;
  }
}

export default new User();
