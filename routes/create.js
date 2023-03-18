const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const db = mysql.createPool(require("../lib/config").user);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/create_folder", async (req, res) => {
  const { folder_id, formData } = req.body;
  const result = await db.query(
    `SELECT folder_name from voca_folder WHERE parent_id=? AND folder_name=?
  `,
    [folder_id, formData.value1]
  );
  if (!Boolean(result[0][0])) {
    await db.query(
      `INSERT INTO voca_folder(user_id,parent_id,folder_name) VALUES(?,?,?)`,
      [req.user[0].user_id, folder_id, formData.value1]
    );
    res.send(["폴더가 생성되었습니다", "success", "folder"]);
  } else {
    res.send([
      "동일한 폴더명이 해당 폴더 내에 존재합니다",
      "warning",
      "folder",
    ]);
  }
});

router.post("/create_file", async (req, res) => {
  const { folder_id, formData } = req.body;
  const result = await db.query(
    `SELECT file_name from voca_file WHERE folder_id=? AND file_name=?`,
    [folder_id, formData.value1]
  );
  if (!Boolean(result[0][0])) {
    await db.query(
      `INSERT INTO voca_file(user_id,folder_id,file_name) VALUES(?,?,?)`,
      [req.user[0].user_id, folder_id, formData.value1]
    );
    res.send(["단어장이 생성되었습니다", "success", "file"]);
  } else {
    res.send([
      "동일한 단어장명이 해당 폴더 내에 존재합니다",
      "warning",
      "file",
    ]);
  }
});

router.post("/create_data", async (req, res) => {
  const { folder_id, file_id } = req.body;
  const { voca, voca_mean, exam, exam_mean } = req.body.formData;
  await db.query(
    `INSERT INTO voca_data(user_id,folder_id,file_id,voca,voca_mean,exam,exam_mean) VALUES(?,?,?,?,?,?,?)`,
    [req.user[0].user_id, folder_id, file_id, voca, voca_mean, exam, exam_mean]
  );
  res.send(["데이터가 추가되었습니다", "success", "data"]);
});

module.exports = router;
