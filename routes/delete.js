const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

const db = mysql.createPool(require("../lib/config").user);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

require("dotenv").config();

router.post("/delete_folder", async (req, res) => {
  const post = req.body;
  if (post.folder_id === "1") {
    res.send(["Home 폴더는 삭제하실 수 없습니다", "warning"]);
  } else {
    const [results] = await db.query(
      `
      SELECT parent_id FROM voca_folder WHERE folder_id=?;
      DELETE FROM voca_data WHERE folder_id=?;
      DELETE FROM voca_file WHERE folder_id=?;
      DELETE FROM voca_folder WHERE folder_id=?;
    `,
      [post.folder_id, post.folder_id, post.folder_id, post.folder_id]
    );

    res.send([
      "폴더가 삭제되었습니다",
      "success",
      "folder",
      results[0][0].parent_id,
    ]);
  }
});

router.post("/delete_file", async (req, res) => {
  const post = req.body;
  await db.query(
    `
    DELETE FROM voca_data WHERE file_id=?;
    DELETE FROM voca_file WHERE file_id=?;
  `,
    [post.file_id, post.file_id]
  );
  res.send(["단어장이 삭제되었습니다", "success", "file"]);
});

router.post("/delete_data", async (req, res) => {
  const post = req.body;
  try {
    await db.query(
      `DELETE FROM voca_data WHERE data_id=?
    `,
      [post.data_id]
    );
    res.send(["데이터가 삭제되었습니다", "success", "data"]);
  } catch (err) {
    console.error(err);
  }
});

router.post("/user", async (req, res) => {
  const post = req.body;
  const password = post.formData.value1;
  const user_id = req.user[0].user_id;

  const result = await db.query(
    "SELECT password FROM localuser WHERE user_id=?",
    [user_id]
  );
  const compareResult = await bcrypt.compare(password, result[0][0].password);
  if (compareResult) {
    req.logout(async (err) => {
      if (err) {
        return next(err);
      }
      await db.query(
        `DELETE FROM voca_data WHERE user_id=?;
      DELETE FROM voca_file WHERE user_id=?;
      DELETE FROM voca_folder WHERE user_id=?;
      DELETE FROM localuser WHERE user_id=?;`,
        [user_id, user_id, user_id, user_id]
      );
      res.send("success");
    });
  } else {
    res.send(["비밀번호가 일치하지 않습니다", "warning", "set"]);
  }
});

module.exports = router;
