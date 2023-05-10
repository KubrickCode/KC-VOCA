import pool from "../db";

class Folder {
  async createFolder(user_id: number, parent_id: number, name: string) {
    const result = await pool.query(
      "INSERT INTO Folders (user_id, parent_id, name) VALUES (?, ?, ?)",
      [user_id, parent_id, name]
    );
    return result;
  }

  async getFolders(user_id: number) {
    const [result] = await pool.query(
      "SELECT * FROM Folders WHERE user_id = ?",
      [user_id]
    );
    return result;
  }

  async renameFolder(id: number, name: string) {
    const [result] = await pool.query("UPDATE Folders SET name=? WHERE id=?", [
      name,
      id,
    ]);
    return result;
  }

  async deleteFolder(id: number) {
    await pool.query("DELETE FROM WordData WHERE folder_id = ?", [id]);

    await pool.query("DELETE FROM Words WHERE folder_id = ?", [id]);

    const [result] = await pool.query("DELETE FROM Folders WHERE id = ?", [id]);

    return result;
  }

  async moveFolder(id: number, parent_id: number) {
    const [result] = await pool.query(
      "UPDATE Folders SET parent_id=? WHERE id=?",
      [parent_id, id]
    );
    return result;
  }
}

export default new Folder();
