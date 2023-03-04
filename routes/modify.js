const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const myModule = require("../lib/myModule");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
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

router.post("/move_folder", (req, res) => {
  const post = req.body;
  db.query(
    `SELECT parent_id FROM voca_folder WHERE folder_id=?`,
    [post.folder_id],
    (err, result) => {
      const parent_id = result[0].parent_id;
      if (parent_id == "0") {
        res.send(["Home 폴더는 이동할 수 없습니다", "error", "folder"]);
      } else if (
        parent_id == post.parent_folder ||
        post.parent_folder == post.folder_id
      ) {
        res.send(["해당 위치로 이동할 수 없습니다", "error", "folder"]);
      } else {
        db.query(
          `UPDATE voca_folder SET parent_id=? WHERE folder_id=?`,
          [post.parent_folder, post.folder_id],
          (err, result) => {
            res.send(["폴더가 이동되었습니다", "success", "folder"]);
          }
        );
      }
    }
  );
});

router.post("/move_file", (req, res) => {
  const post = req.body;
  db.query(
    `
    UPDATE voca_file SET folder_id=? WHERE file_id=?
    `,
    [post.parent_folder, post.file_id],
    () => {
      res.send(["단어장이 이동되었습니다", "success", "file"]);
    }
  );
});

router.post("/modify_data", (req, res) => {
  const post = req.body;
  const formData = post.formData;
  db.query(
    `
  UPDATE voca_data SET voca=?, voca_mean=?, exam=?, exam_mean=? WHERE data_id=?
  `,
    [
      formData.voca,
      formData.voca_mean,
      formData.exam,
      formData.exam_mean,
      post.data_id,
    ],
    (err, result) => {
      res.send(["데이터가 수정되었습니다", "success", "data"]);
    }
  );
});

router.post("/nickname", async (req, res) => {
  try {
    const {
      formData: { value1: nickname },
    } = req.body;
    const { user_id } = req.user[0];

    const result = await db.query(
      "SELECT nickname FROM localuser WHERE nickname=?",
      [nickname]
    );

    if (result[0] && result[0].nickname) {
      res.send(["같은 닉네임이 존재합니다", "warning", "set"]);
    } else {
      await db.query("UPDATE localuser SET nickname=? WHERE user_id=?", [
        nickname,
        user_id,
      ]);
      res.send(["닉네임이 변경되었습니다", "success", "set"]);
    }
  } catch (err) {
    console.error(err);
    res.send(["An error occurred", "error", "unset"]);
  }
});

router.post("/password", (req, res) => {
  const {
    formData: { value1: password, value2: password2 },
  } = req.body;
  const { user_id } = req.user[0];
  db.query(
    "SELECT password FROM localuser WHERE user_id=?",
    [user_id],
    (err, result) => {
      bcrypt.compare(password, result[0].password, (err, results) => {
        if (results) {
          bcrypt.hash(password2, 10, (err, hash) => {
            db.query(
              `
              UPDATE localuser SET password=? WHERE user_id=?
              `,
              [hash, user_id],
              () => {
                res.send(["비밀번호가 변경되었습니다", "success", "set"]);
              }
            );
          });
        } else {
          res.send(["기존 비밀번호가 일치하지 않습니다", "warning", "set"]);
        }
      });
    }
  );
});

module.exports = router;
