import mysql, { RowDataPacket } from "mysql2/promise";
const db = mysql.createPool(require("./config").user);

const checkDuplicate = async (
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

export default checkDuplicate;
