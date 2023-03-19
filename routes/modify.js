const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const db = mysql.createPool(require("../lib/config").user);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/rename_folder", async (req, res) => {
  const { folder_id, formData } = req.body;
  try {
    const parent = await db.query(
      `SELECT parent_id from voca_folder WHERE folder_id=?`,
      [folder_id]
    );
    const result = await db.query(
      `SELECT folder_name from voca_folder WHERE parent_id=? AND folder_name=?
    `,
      [parent[0][0].parent_id, formData.value1]
    );

    if (folder_id === "1") {
      res.send(["Home 폴더명은 변경하실 수 없습니다", "error", "folder"]);
    } else if (!Boolean(result[0][0])) {
      await db.query(`UPDATE voca_folder SET folder_name=? WHERE folder_id=?`, [
        formData.value1,
        folder_id,
      ]);
      res.send(["폴더명이 변경되었습니다", "success", "folder"]);
    } else {
      res.send([
        "동일한 폴더명이 부모 폴더 내에 존재합니다",
        "warning",
        "folder",
      ]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(["Internal Server Error", "error"]);
  }
});

router.post("/rename_file", async (req, res) => {
  const { folder_id, formData, file_id } = req.body;
  try {
    const result = await db.query(
      `SELECT file_name from voca_file WHERE folder_id=? AND file_name=?`,
      [folder_id, formData.value1]
    );

    if (!Boolean(result[0][0])) {
      await db.query(`UPDATE voca_file SET file_name=? WHERE file_id=?`, [
        formData.value1,
        file_id,
      ]);
      res.send(["단어장명이 변경되었습니다", "success", "file"]);
    } else {
      res.send([
        "동일한 단어장명이 해당 폴더 내에 존재합니다",
        "warning",
        "file",
      ]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(["Internal Server Error", "error"]);
  }
});

router.post("/favorites", async (req, res) => {
  const post = req.body;
  try {
    const isFavorite = post.file_favorites == 0;
    const fav = isFavorite ? 1 : 0;
    const msg = isFavorite
      ? "단어장이 즐겨찾기에 등록되었습니다"
      : "단어장이 즐겨찾기에서 해제되었습니다";

    await db.query(`UPDATE voca_file SET favorites=? WHERE file_id=?`, [
      fav,
      post.file_id,
    ]);
    res.send([msg, "success", "file"]);
  } catch (err) {
    console.error(err);
    res.status(500).send(["Internal Server Error", "error"]);
  }
});

router.post("/shared", async (req, res) => {
  const { file_id, file_shared } = req.body;
  try {
    const isShared = file_shared == 0;
    const sha = isShared ? 1 : 0;
    const msg = isShared
      ? "단어장이 공유되었습니다"
      : "단어장이 공유 해제되었습니다";

    await db.query(
      `UPDATE voca_file SET shared=? WHERE file_id=?
    `,
      [sha, file_id]
    );

    res.send([msg, "success", "file"]);
  } catch (err) {
    console.error(err);
  }
});

router.post("/move_folder", async (req, res) => {
  const post = req.body;
  try {
    const [rows] = await db.query(
      `SELECT parent_id FROM voca_folder WHERE folder_id=?`,
      [post.folder_id]
    );
    const parent_id = rows[0].parent_id;
    if (parent_id === "0") {
      res.send(["Home 폴더는 이동할 수 없습니다", "error", "folder"]);
    } else if (
      parent_id == post.parent_folder ||
      post.parent_folder == post.folder_id
    ) {
      res.send(["해당 위치로 이동할 수 없습니다", "error", "folder"]);
    } else {
      await db.query(`UPDATE voca_folder SET parent_id=? WHERE folder_id=?`, [
        post.parent_folder,
        post.folder_id,
      ]);
      res.send(["폴더가 이동되었습니다", "success", "folder"]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(["Internal Server Error", "error"]);
  }
});

router.post("/move_file", async (req, res) => {
  const post = req.body;
  try {
    await db.query(`UPDATE voca_file SET folder_id=? WHERE file_id=?`, [
      post.parent_folder,
      post.file_id,
    ]);
    res.send(["단어장이 이동되었습니다", "success", "file"]);
  } catch (err) {
    console.error(err);
    res.status(500).send(["Internal Server Error", "error"]);
  }
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
  const {
    formData: { value1: nickname },
  } = req.body;
  const { user_id } = req.user[0];
  try {
    const [result] = await db.query(
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

router.post("/password", async (req, res) => {
  const {
    formData: { value1: password, value2: password2 },
  } = req.body;
  const { user_id } = req.user[0];
  try {
    const [result] = await db.query(
      "SELECT password FROM localuser WHERE user_id=?",
      [user_id]
    );
    const isPasswordMatch = await bcrypt.compare(password, result[0].password);

    if (isPasswordMatch) {
      const hash = await bcrypt.hash(password2, 10);
      await db.query("UPDATE localuser SET password=? WHERE user_id=?", [
        hash,
        user_id,
      ]);
      res.send(["비밀번호가 변경되었습니다", "success", "set"]);
    } else {
      res.send(["기존 비밀번호가 일치하지 않습니다", "warning", "set"]);
    }
  } catch (err) {
    console.error(err);
    res.send(["An error occurred", "error", "unset"]);
  }
});

module.exports = router;
