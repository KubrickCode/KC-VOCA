const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const db = mysql.createConnection(require("../lib/config").user);
db.connect();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

require("dotenv").config();

const url = process.env.REDIRECT_ROOT;

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

router.post("/delete_file", async (req, res) => {
  const post = req.body;
  const data = await db.query(
    `
    DELETE FROM voca_data WHERE file_id=?;
    DELETE FROM voca_file WHERE file_id=?;
    `,
    [post.file_id, post.file_id]
  );
  res.send(["단어장이 삭제되었습니다", "success", "file"]);
});

router.post("/delete_data", (req, res) => {
  const post = req.body;
  db.query(
    `DELETE FROM voca_data WHERE data_id=?
  `,
    [post.data_id],
    () => {
      res.send(["데이터가 삭제되었습니다", "success", "data"]);
    }
  );
});

router.post("/user", (req, res) => {
  const post = req.body;
  const password = post.formData.value1;
  const user_id = req.user[0].user_id;
  db.query(
    "SELECT password FROM localuser WHERE user_id=?",
    [user_id],
    (err, result) => {
      bcrypt.compare(password, result[0].password, (err, results) => {
        if (results) {
          req.logout((err) => {
            if (err) {
              return next(err);
            }
            db.query(
              `
          DELETE FROM voca_data WHERE user_id=?;
          DELETE FROM voca_file WHERE user_id=?;
          DELETE FROM voca_folder WHERE user_id=?;
          DELETE FROM localuser WHERE user_id=?;
          `,
              [user_id, user_id, user_id, user_id, user_id],
              (err, result) => {
                res.send(true);
              }
            );
          });
        } else {
          res.send(["비밀번호가 일치하지 않습니다", "warning", "set"]);
        }
      });
    }
  );
});

module.exports = router;
