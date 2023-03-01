const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const myModule = require("../lib/myModule");
const mysql = require("mysql");
const db = mysql.createConnection(require("../lib/config").user);
db.connect();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/rename_folder", async (req, res) => {
  const post = req.body;
  const result = await myModule.checkFolderName(
    post.folder_id,
    post.formData.value1
  );
  if (post.folder_id === "1") {
    res.send(["Home 폴더명은 변경하실 수 없습니다", "warning", "folder"]);
  } else if (result) {
    db.query(
      `UPDATE voca_folder SET folder_name=? WHERE folder_id=?
      `,
      [post.formData.value1, post.folder_id],
      () => {
        res.send(["폴더명이 변경되었습니다", "success", "folder"]);
      }
    );
  } else {
    res.send([
      "동일한 폴더명이 부모 폴더 내에 존재합니다",
      "warning",
      "folder",
    ]);
  }
});

router.post("/rename_file", async (req, res) => {
  const post = req.body;
  const result = await myModule.checkFileName(
    post.folder_id,
    post.formData.value1
  );
  if (result) {
    db.query(
      `UPDATE voca_file SET file_name=? WHERE file_id=?
      `,
      [post.formData.value1, post.file_id],
      () => {
        res.send(["단어장명이 변경되었습니다", "success", "file"]);
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

router.post("/favorites", (req, res) => {
  const post = req.body;
  let fav;
  let msg;
  if (post.file_favorites == 0) {
    fav = 1;
    msg = "단어장이 즐겨찾기에 등록되었습니다";
  } else {
    fav = 0;
    msg = "단어장이 즐겨찾기에서 해제되었습니다";
  }
  db.query(
    `UPDATE voca_file SET favorites=? WHERE file_id=?
  `,
    [fav, post.file_id],
    (err, result) => {
      res.send([msg, "success", "file"]);
    }
  );
});

router.post("/shared", (req, res) => {
  const post = req.body;
  let sha;
  let msg;
  if (post.file_shared == 0) {
    sha = 1;
    msg = "단어장이 공유되었습니다";
  } else {
    sha = 0;
    msg = "단어장이 공유 해제되었습니다";
  }
  db.query(
    `UPDATE voca_file SET shared=? WHERE file_id=?
  `,
    [sha, post.file_id],
    (err, result) => {
      res.send([msg, "success", "file"]);
    }
  );
});

module.exports = router;
