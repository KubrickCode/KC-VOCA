import express from "express";
import bodyParser from "body-parser";
import mysql, { RowDataPacket } from "mysql2/promise";
import bcrypt from "bcrypt";
import { user as userConfig } from "../lib/config";
import asyncHandler from "../middlewares/asyncHandler";

const db = mysql.createPool(userConfig);

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post(
  "/delete_folder",
  asyncHandler(async (req, res) => {
    const { folder_id } = req.body;
    const query = [
      "SELECT parent_id FROM voca_folder WHERE folder_id=?;",
      `DELETE FROM voca_data WHERE folder_id=?;
      DELETE FROM voca_file WHERE folder_id=?;
      DELETE FROM voca_folder WHERE folder_id=?;`,
    ];
    const target = [[folder_id], [folder_id, folder_id, folder_id]];
    const [result1] = await db.query<[RowDataPacket]>(query[0], target[0]);
    const parent_id = result1[0].parent_id;
    if (parent_id === 0) {
      res.send(["Home 폴더는 삭제하실 수 없습니다", "error", "folder"]);
    } else {
      await db.query<[RowDataPacket[]]>(query[1], target[1]);
      res.send(["폴더가 삭제되었습니다", "success", "folder", parent_id]);
    }
  })
);

router.post(
  "/delete_file",
  asyncHandler(async (req, res) => {
    const { file_id } = req.body;
    const query = `
  DELETE FROM voca_data WHERE file_id=?;
  DELETE FROM voca_file WHERE file_id=?;
`;
    const target = [file_id, file_id];
    await db.query(query, target);
    res.send(["단어장이 삭제되었습니다", "success", "file"]);
  })
);

router.post(
  "/delete_data",
  asyncHandler(async (req, res) => {
    const { data_id } = req.body;
    const query = `DELETE FROM voca_data WHERE data_id=?`;
    const target = [data_id];
    await db.query(query, target);
    res.send(["데이터가 삭제되었습니다", "success", "data"]);
  })
);

router.post(
  "/user",
  asyncHandler(async (req, res, next) => {
    const password = req.body.formData.value1;
    const { user_id } = (req.user as { user_id: number }[])[0];
    const query = [
      "SELECT password FROM localuser WHERE user_id=?",
      `DELETE FROM voca_data WHERE user_id=?;
      DELETE FROM voca_file WHERE user_id=?;
      DELETE FROM voca_folder WHERE user_id=?;
      DELETE FROM localuser WHERE user_id=?;`,
    ];
    const target = [[user_id], [user_id, user_id, user_id, user_id]];
    const [result] = await db.query<RowDataPacket[]>(query[0], target[0]);
    const compareResult = await bcrypt.compare(password, result[0].password);
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
  })
);

export default router;
