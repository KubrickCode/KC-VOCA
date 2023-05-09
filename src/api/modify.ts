import express from "express";
import bodyParser from "body-parser";
import mysql, { RowDataPacket } from "mysql2/promise";
import { checkDuplicate } from "../lib/module";
import bcrypt from "bcrypt";
import { user as userConfig } from "../lib/config";
import asyncHandler from "../middlewares/asyncHandler";
import { isDescendantFolder } from "../lib/module";

const db = mysql.createPool(userConfig);

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post(
  "/rename_folder",
  asyncHandler(async (req, res) => {
    const { folder_id, formData } = req.body;
    const query = [
      `SELECT parent_id from voca_folder WHERE folder_id=?`,
      `UPDATE voca_folder SET folder_name=? WHERE folder_id=?`,
    ];
    const target = [[folder_id], [formData.value1, folder_id]];
    const parent = await db.query<RowDataPacket[]>(query[0], target[0]);
    const result = await checkDuplicate(
      "folder",
      parent[0][0].parent_id,
      formData.value1
    );

    if (parent[0][0].parent_id === 0) {
      res.send(["Home 폴더명은 변경하실 수 없습니다", "error", "folder"]);
    } else if (!Boolean(result[0])) {
      await db.query(query[1], target[1]);
      res.send(["폴더명이 변경되었습니다", "success", "folder"]);
    } else {
      res.send([
        "동일한 폴더명이 부모 폴더 내에 존재합니다",
        "warning",
        "folder",
      ]);
    }
  })
);

router.post(
  "/rename_file",
  asyncHandler(async (req, res) => {
    const { folder_id, formData, file_id } = req.body;
    const query = `UPDATE voca_file SET file_name=? WHERE file_id=?`;
    const target = [formData.value1, file_id];
    const result = await checkDuplicate("file", folder_id, formData.value1);

    if (!Boolean(result[0])) {
      await db.query(query, target);
      res.send(["단어장명이 변경되었습니다", "success", "file"]);
    } else {
      res.send([
        "동일한 단어장명이 해당 폴더 내에 존재합니다",
        "warning",
        "file",
      ]);
    }
  })
);

router.post(
  "/favorites",
  asyncHandler(async (req, res) => {
    const { file_id, file_favorites } = req.body;
    const query = `UPDATE voca_file SET favorites=? WHERE file_id=?`;

    const isFavorite = file_favorites == 0;
    const fav = isFavorite ? 1 : 0;
    const target = [fav, file_id];
    const msg = isFavorite
      ? "단어장이 즐겨찾기에 등록되었습니다"
      : "단어장이 즐겨찾기에서 해제되었습니다";

    await db.query(query, target);
    res.send([msg, "success", "file"]);
  })
);

router.post(
  "/shared",
  asyncHandler(async (req, res) => {
    const { file_id, file_shared } = req.body;
    const query = `UPDATE voca_file SET shared=? WHERE file_id=?`;
    const isShared = file_shared == 0;
    const sha = isShared ? 1 : 0;
    const target = [sha, file_id];
    const msg = isShared
      ? "단어장이 공유되었습니다"
      : "단어장이 공유 해제되었습니다";

    await db.query(query, target);

    res.send([msg, "success", "file"]);
  })
);

router.post(
  "/move_folder",
  asyncHandler(async (req, res) => {
    const { folder_id, parent_folder } = req.body;
    const query = [
      `SELECT parent_id FROM voca_folder WHERE folder_id=?`,
      `UPDATE voca_folder SET parent_id=? WHERE folder_id=?`,
    ];
    const target = [[folder_id], [parent_folder, folder_id]];
    const [rows] = await db.query<RowDataPacket[]>(query[0], target[0]);
    const parent_id = rows[0].parent_id;
    if (parent_id === 0) {
      res.send(["Home 폴더는 이동할 수 없습니다", "error", "folder"]);
    } else if (
      parent_id == parent_folder ||
      parent_folder == folder_id ||
      (await isDescendantFolder(folder_id, parent_folder))
    ) {
      res.send(["해당 위치로 이동할 수 없습니다", "error", "folder"]);
    } else {
      await db.query(query[1], target[1]);
      res.send(["폴더가 이동되었습니다", "success", "folder"]);
    }
  })
);

router.post(
  "/move_file",
  asyncHandler(async (req, res) => {
    const { parent_folder, file_id } = req.body;
    const query = `UPDATE voca_file SET folder_id=? WHERE file_id=?`;
    const target = [parent_folder, file_id];
    await db.query(query, target);
    res.send(["단어장이 이동되었습니다", "success", "file"]);
  })
);

router.post(
  "/modify_data",
  asyncHandler(async (req, res) => {
    const { data_id } = req.body;
    const { voca, voca_mean, exam, exam_mean } = req.body.formData;
    const query = `UPDATE voca_data SET voca=?, voca_mean=?, exam=?, exam_mean=? WHERE data_id=?`;
    const target = [voca, voca_mean, exam, exam_mean, data_id];
    await db.query(query, target);
    res.send(["데이터가 수정되었습니다", "success", "data"]);
  })
);

router.post(
  "/nickname",
  asyncHandler(async (req, res) => {
    const {
      formData: { value1: nickname },
    } = req.body;
    const { user_id } = (req.user as { user_id: number }[])[0];
    const query = [
      "SELECT nickname FROM localuser WHERE nickname=?",
      "UPDATE localuser SET nickname=? WHERE user_id=?",
    ];
    const target = [[nickname], [nickname, user_id]];
    const [result] = await db.query<RowDataPacket[]>(query[0], target[0]);

    if (result[0] && result[0].nickname) {
      res.send(["같은 닉네임이 존재합니다", "warning", "set"]);
    } else {
      await db.query(query[1], target[1]);
      res.send(["닉네임이 변경되었습니다", "success", "set"]);
    }
  })
);

router.post(
  "/password",
  asyncHandler(async (req, res) => {
    const {
      formData: { value1: password, value2: password2 },
    } = req.body;
    const { user_id } = (req.user as { user_id: number }[])[0];
    const query = [
      "SELECT password FROM localuser WHERE user_id=?",
      "UPDATE localuser SET password=? WHERE user_id=?",
    ];
    const target = [user_id];
    const [result] = await db.query<RowDataPacket[]>(query[0], target);
    const isPasswordMatch = await bcrypt.compare(password, result[0].password);

    if (isPasswordMatch) {
      const hash = await bcrypt.hash(password2, 10);
      const tartget2 = [hash, user_id];
      await db.query(query[1], tartget2);
      res.send(["비밀번호가 변경되었습니다", "success", "set"]);
    } else {
      res.send(["기존 비밀번호가 일치하지 않습니다", "warning", "set"]);
    }
  })
);

export default router;