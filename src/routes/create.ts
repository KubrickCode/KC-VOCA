import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import checkDuplicate from "../lib/module";

const db = mysql.createPool(require("../lib/config").user);

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/create_folder", async (req, res) => {
  const { folder_id, formData } = req.body;
  const { user_id } = (req.user as { user_id: number }[])[0];
  const query = `INSERT INTO voca_folder(user_id,parent_id,folder_name) VALUES(?,?,?)`;
  const target = [user_id, folder_id, formData.value1];
  try {
    const result = await checkDuplicate("folder", folder_id, formData.value1);
    if (!Boolean(result[0])) {
      await db.query(query, target);
      res.send(["폴더가 생성되었습니다", "success", "folder"]);
    } else {
      res.send([
        "동일한 폴더명이 해당 폴더 내에 존재합니다",
        "warning",
        "folder",
      ]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/create_file", async (req, res) => {
  const { folder_id, formData } = req.body;
  const { user_id } = (req.user as { user_id: number }[])[0];
  const query = `INSERT INTO voca_file(user_id,folder_id,file_name) VALUES(?,?,?)`;
  const target = [user_id, folder_id, formData.value1];
  try {
    const result = await checkDuplicate("file", folder_id, formData.value1);
    if (!Boolean(result[0])) {
      await db.query(query, target);
      res.send(["단어장이 생성되었습니다", "success", "file"]);
    } else {
      res.send([
        "동일한 단어장명이 해당 폴더 내에 존재합니다",
        "warning",
        "file",
      ]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/create_data", async (req, res) => {
  const { folder_id, file_id } = req.body;
  const { user_id } = (req.user as { user_id: number }[])[0];
  const { voca, voca_mean, exam, exam_mean } = req.body.formData;
  const query = `INSERT INTO voca_data(user_id,folder_id,file_id,voca,voca_mean,exam,exam_mean) VALUES(?,?,?,?,?,?,?)`;
  const target = [
    user_id,
    folder_id,
    file_id,
    voca,
    voca_mean,
    exam,
    exam_mean,
  ];
  try {
    await db.query(query, target);
    res.send(["데이터가 추가되었습니다", "success", "data"]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

export default router;
