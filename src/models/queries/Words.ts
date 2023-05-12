import { RowDataPacket } from "mysql2";
import pool from "../DB";

class Words {
  async createWords(user_id: number, folder_id: number, name: string) {
    const result = await pool.query(
      "INSERT INTO words (user_id, folder_id, name) VALUES (?, ?, ?)",
      [user_id, folder_id, name]
    );
    return result;
  }

  async getWords(folder_id: number) {
    const [result] = await pool.query(
      `SELECT words.*, users.nickname
      FROM words 
      JOIN folders ON words.folder_id = folders.id
      JOIN users ON folders.user_id = users.id
      WHERE words.folder_id = ?`,
      [folder_id]
    );
    return result;
  }

  async getRecentWords(user_id: number) {
    const [result] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM words WHERE user_id=? ORDER BY last_seen_time DESC",
      [user_id]
    );
    return result.slice(0, 10);
  }

  async getFavWords(user_id: number) {
    const [result] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM words WHERE is_favorite=1 AND user_id=?",
      [user_id]
    );
    return result;
  }

  async getSharedWords() {
    const [result] = await pool.query<RowDataPacket[]>(
      `SELECT words.*, users.nickname 
    FROM words 
    INNER JOIN users ON words.user_id = users.id
    WHERE words.is_shared = 1`
    );
    return result;
  }

  async renameWords(id: number, name: string) {
    const [result] = await pool.query("UPDATE words SET name=? WHERE id=?", [
      name,
      id,
    ]);
    return result;
  }

  async deleteWords(id: number) {
    await pool.query("DELETE FROM worddata WHERE words_id = ?", [id]);

    const [result] = await pool.query("DELETE FROM words WHERE id = ?", [id]);

    return result;
  }

  async moveWords(id: number, folder_id: number) {
    const [result] = await pool.query(
      "UPDATE words SET folder_id=? WHERE id=?",
      [folder_id, id]
    );
    return result;
  }

  async changeStatus(type: string, id: number, status: number) {
    const [result] = await pool.query(
      `UPDATE words SET is_${type}=? WHERE id=?`,
      [status === 0 ? 1 : 0, id]
    );
    return result;
  }

  async getFolderIdFromWordsId(id: number) {
    const [result] = await pool.query<RowDataPacket[]>(
      "SELECT folder_id FROM words WHERE id=?",
      [id]
    );
    return result;
  }

  async updateRecentView(id: number) {
    await pool.query(
      "Update words SET last_seen_time=CURRENT_TIMESTAMP WHERE id=?",
      [id]
    );
  }
}

export default new Words();
