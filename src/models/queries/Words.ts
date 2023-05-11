import { RowDataPacket } from "mysql2";
import pool from "../db";

class Words {
  async createWords(user_id: number, folder_id: number, name: string) {
    const result = await pool.query(
      "INSERT INTO Words (user_id, folder_id, name) VALUES (?, ?, ?)",
      [user_id, folder_id, name]
    );
    return result;
  }

  async getWords(folder_id: number) {
    const [result] = await pool.query(
      `SELECT Words.*, Users.nickname
      FROM Words 
      JOIN Folders ON Words.folder_id = Folders.id
      JOIN Users ON Folders.user_id = Users.id
      WHERE Words.folder_id = ?`,
      [folder_id]
    );
    return result;
  }

  async getRecentWords(user_id: number) {
    const [result] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Words WHERE user_id=? ORDER BY last_seen_time DESC",
      [user_id]
    );
    return result.slice(0, 10);
  }

  async getFavWords(user_id: number) {
    const [result] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Words WHERE is_favorite=1 AND user_id=?",
      [user_id]
    );
    return result;
  }

  async getSharedWords() {
    const [result] = await pool.query<RowDataPacket[]>(
      `SELECT Words.*, Users.nickname 
    FROM Words 
    INNER JOIN Users ON Words.user_id = Users.id
    WHERE Words.is_shared = 1`
    );
    return result;
  }

  async renameWords(id: number, name: string) {
    const [result] = await pool.query("UPDATE Words SET name=? WHERE id=?", [
      name,
      id,
    ]);
    return result;
  }

  async deleteWords(id: number) {
    await pool.query("DELETE FROM WordData WHERE words_id = ?", [id]);

    const [result] = await pool.query("DELETE FROM Words WHERE id = ?", [id]);

    return result;
  }

  async moveWords(id: number, folder_id: number) {
    const [result] = await pool.query(
      "UPDATE Words SET folder_id=? WHERE id=?",
      [folder_id, id]
    );
    return result;
  }

  async changeStatus(type: string, id: number, status: number) {
    const [result] = await pool.query(
      `UPDATE Words SET is_${type}=? WHERE id=?`,
      [status === 0 ? 1 : 0, id]
    );
    return result;
  }

  async getFolderIdFromWordsId(id: number) {
    const [result] = await pool.query<RowDataPacket[]>(
      "SELECT folder_id FROM Words WHERE id=?",
      [id]
    );
    return result;
  }

  async updateRecentView(id: number) {
    await pool.query(
      "Update Words SET last_seen_time=CURRENT_TIMESTAMP WHERE id=?",
      [id]
    );
  }
}

export default new Words();
