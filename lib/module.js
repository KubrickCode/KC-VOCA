const mysql = require("mysql2/promise");
const db = mysql.createPool(require("../lib/config").user);

const checkDuplicate = async (type, folder, name) => {
  const query = `SELECT ${type}_name from voca_${type} WHERE ${
    type === "folder" ? "parent_id" : "folder_id"
  }=? AND ${type}_name=?`;
  const target = [folder, name];
  const result = await db.query(query, target);
  return result;
};

module.exports = {
  checkDuplicate,
};
