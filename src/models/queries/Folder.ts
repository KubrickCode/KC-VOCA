import { RowDataPacket } from "mysql2";
import pool from "../DB";

class Folder {
  async createFolder(user_id: number, parent_id: number, name: string) {
    const result = await pool.query(
      "INSERT INTO folders (user_id, parent_id, name) VALUES (?, ?, ?)",
      [user_id, parent_id, name]
    );
    return result;
  }

  async getFolders(user_id: number) {
    const [result] = await pool.query(
      "SELECT * FROM folders WHERE user_id = ?",
      [user_id]
    );
    return result;
  }

  async renameFolder(id: number, name: string) {
    const [result] = await pool.query("UPDATE folders SET name=? WHERE id=?", [
      name,
      id,
    ]);
    return result;
  }

  async deleteFolder(id: number) {
    await pool.query("DELETE FROM worddata WHERE folder_id = ?", [id]);

    await pool.query("DELETE FROM words WHERE folder_id = ?", [id]);

    const [result] = await pool.query("DELETE FROM folders WHERE id = ?", [id]);

    return result;
  }

  async getChildFolders(id: number): Promise<number[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM folders WHERE parent_id = ?",
      [id]
    );
    const children = rows.map((row) => row.id);
    for (const childId of children) {
      const grandChildren = await this.getChildFolders(childId);
      children.push(...grandChildren);
    }
    return children;
  }

  async moveFolder(id: number, parent_id: number) {
    const childFolderIds = await this.getChildFolders(id);
    if (childFolderIds.includes(parent_id)) {
      return false;
    }

    await pool.query("UPDATE folders SET parent_id=? WHERE id=?", [
      parent_id,
      id,
    ]);
    return true;
  }
}

export default new Folder();
