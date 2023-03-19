const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
const db = mysql.createPool(require("../lib/config").user);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/delete_folder", async (req, res) => {
  const { folder_id } = req.body;
  const query = `
  SELECT parent_id FROM voca_folder WHERE folder_id=?;
  DELETE FROM voca_data WHERE folder_id=?;
  DELETE FROM voca_file WHERE folder_id=?;
  DELETE FROM voca_folder WHERE folder_id=?;
`;
  const target = [folder_id, folder_id, folder_id, folder_id];
  try {
    if (folder_id === "1") {
      res.send(["Home 폴더는 삭제하실 수 없습니다", "warning"]);
    } else {
      const [results] = await db.query(query, target);

      res.send([
        "폴더가 삭제되었습니다",
        "success",
        "folder",
        results[0][0].parent_id,
      ]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/delete_file", async (req, res) => {
  const { file_id } = req.body;
  const query = `
  DELETE FROM voca_data WHERE file_id=?;
  DELETE FROM voca_file WHERE file_id=?;
`;
  const target = [file_id, file_id];
  try {
    await db.query(query, target);
    res.send(["단어장이 삭제되었습니다", "success", "file"]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/delete_data", async (req, res) => {
  const { data_id } = req.body;
  const query = `DELETE FROM voca_data WHERE data_id=?`;
  const target = [data_id];
  try {
    await db.query(query, target);
    res.send(["데이터가 삭제되었습니다", "success", "data"]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/user", async (req, res) => {
  const password = req.body.formData.value1;
  const { user_id } = req.user[0];
  const query = [
    "SELECT password FROM localuser WHERE user_id=?",
    `DELETE FROM voca_data WHERE user_id=?;
  DELETE FROM voca_file WHERE user_id=?;
  DELETE FROM voca_folder WHERE user_id=?;
  DELETE FROM localuser WHERE user_id=?;`,
  ];
  const target = [[user_id], [user_id, user_id, user_id, user_id]];
  try {
    const result = await db.query(query[0], target[0]);
    const compareResult = await bcrypt.compare(password, result[0][0].password);
    if (compareResult) {
      req.logout(async (err) => {
        if (err) {
          return next(err);
        }
        await db.query(query[1], target[1]);
        res.send("success");
      });
    } else {
      res.send(["비밀번호가 일치하지 않습니다", "warning", "set"]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
