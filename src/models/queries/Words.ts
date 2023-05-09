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
      "SELECT * FROM Words WHERE folder_id = ?",
      [folder_id]
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
}

export default new Words();
