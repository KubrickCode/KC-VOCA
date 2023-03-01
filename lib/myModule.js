const mysql = require("mysql");
const db = mysql.createConnection(require("../lib/config").user);
db.connect();

module.exports = {
  checkFileName: (folder_id, file_name) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT file_name from voca_file WHERE folder_id=? AND file_name=?
        `,
        [folder_id, file_name],
        (err, result) => {
          resolve(!Boolean(result[0]));
        }
      );
    });
  },

  checkFolderName: (folder_id, folder_name) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT parent_id from voca_folder WHERE folder_id=?`,
        [folder_id],
        (err, result) => {
          console.log(result);
          db.query(
            `SELECT folder_name from voca_folder WHERE parent_id=? AND folder_name=?
          `,
            [result[0].parent_id, folder_name],
            (err, result) => {
              resolve(!Boolean(result[0]));
            }
          );
        }
      );
    });
  },

  checkFolderName2: (folder_id, folder_name) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT folder_name from voca_folder WHERE parent_id=? AND folder_name=?
        `,
        [folder_id, folder_name],
        (err, result) => {
          resolve(!Boolean(result[0]));
        }
      );
    });
  },
};
