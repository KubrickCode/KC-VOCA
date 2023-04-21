import mysql, { RowDataPacket } from "mysql2/promise";
import { user as userConfig } from "./config";

const db = mysql.createPool(userConfig);

export const checkDuplicate = async (
  type: string,
  folder: number,
  name: string
): Promise<RowDataPacket[]> => {
  const query = `SELECT ${type}_name from voca_${type} WHERE ${
    type === "folder" ? "parent_id" : "folder_id"
  }=? AND ${type}_name=?`;
  const target = [folder, name];
  const [result] = await db.query<RowDataPacket[]>(query, target);
  return result;
};

export const isDescendantFolder = async (childId: number, parentId: number) => {
  let currentParentId = parentId;

  while (currentParentId !== 0) {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT parent_id FROM voca_folder WHERE folder_id=?",
      [currentParentId]
    );

    currentParentId = rows[0].parent_id;
    console.log(currentParentId);

    if (currentParentId == childId) {
      return true;
    }
  }
  return false;
};
