const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const myModule = require("../lib/myModule");
const mysql = require("mysql");
const db = mysql.createConnection(require("../lib/config").user);
db.connect();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/create_folder", async (req, res) => {
  const post = req.body;
  const result = await myModule.checkFolderName2(
    post.folder_id,
    post.formData.value1
  );
  if (result) {
    db.query(
      `INSERT INTO voca_folder(user_id,parent_id,folder_name) VALUES(?,?,?)
      `,
      [req.user[0].user_id, post.folder_id, post.formData.value1],
      () => {
        res.send(["폴더가 생성되었습니다", "success", "folder"]);
      }
    );
  } else {
    res.send([
      "동일한 폴더명이 해당 폴더 내에 존재합니다",
      "warning",
      "folder",
    ]);
  }
});

router.post("/create_file", async (req, res) => {
  const post = req.body;
  const result = await myModule.checkFileName(
    post.folder_id,
    post.formData.value1
  );
  if (result) {
    db.query(
      `INSERT INTO voca_file(user_id,folder_id,file_name) VALUES(?,?,?)
      `,
      [req.user[0].user_id, post.folder_id, post.formData.value1],
      () => {
        res.send(["단어장이 생성되었습니다", "success", "file"]);
      }
    );
  } else {
    res.send([
      "동일한 단어장명이 해당 폴더 내에 존재합니다",
      "warning",
      "file",
    ]);
  }
});

router.post("/create_data", (req, res) => {
  const post = req.body;
  const user = req.user[0];
  console.log(post);
  db.query(
    `
      INSERT INTO voca_data(user_id,folder_id,file_id,voca,voca_mean,exam,exam_mean) VALUES(?,?,?,?,?,?,?)
      `,
    [
      user.user_id,
      post.folder_id,
      post.file_id,
      post.formData.voca,
      post.formData.voca_mean,
      post.formData.exam,
      post.formData.exam_mean,
    ],
    () => {
      res.send(["데이터가 추가되었습니다", "success", "data"]);
    }
  );
});

module.exports = router;
