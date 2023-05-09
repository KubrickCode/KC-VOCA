import pool from "../db";
import { UserType } from "../types";

class User {
  async getUserById(id: number) {
    const rows = await pool.query("SELECT * FROM Users WHERE id = ?", [id]);
    return rows[0];
  }

  async createUser(user: {
    email: string;
    nickname: string;
    password: string;
  }) {
    const { email, nickname, password } = user;
    const result = await pool.query(
      "INSERT INTO Users (email, nickname, password) VALUES (?, ?, ?)",
      [email, nickname, password]
    );
    return result;
  }

  async updateUser(id: number, fieldsToUpdate: Partial<UserType>) {
    const setClause = Object.keys(fieldsToUpdate)
      .map((field, i) => `${field} = ?`)
      .join(", ");

    // Generate SQL statement
    const sql = `UPDATE Users SET ${setClause} WHERE id = ?`;

    // Execute query
    const [rows] = await pool.query(sql, [
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
