const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const db = mysql.createConnection(require("../lib/config").user);
db.connect();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/delete_folder", (req, res) => {
  const post = req.body;
  if (post.folder_id === "1") {
    res.send(["Home 폴더는 삭제하실 수 없습니다", "warning"]);
  } else {
    db.query(
      `
      DELETE FROM voca_data WHERE folder_id=?;
      DELETE FROM voca_file WHERE folder_id=?;
      DELETE FROM voca_folder WHERE folder_id=?;
      `,
      [post.folder_id, post.folder_id, post.folder_id],
      () => {
        res.send(["폴더가 삭제되었습니다", "success", "folder"]);
      }
    );
  }
});

router.post("/delete_file", (req, res) => {
  const post = req.body;
  db.query(
    `
    DELETE FROM voca_data WHERE file_id=?;
    DELETE FROM voca_file WHERE file_id=?;
    `,
    [post.file_id, post.file_id],
    () => {
      res.send(["단어장이 삭제되었습니다", "success", "file"]);
    }
  );
});

module.exports = router;
