"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const promise_1 = __importDefault(require("mysql2/promise"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
const db = promise_1.default.createPool(require("../lib/config").user);
router.use(body_parser_1.default.json());
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.post("/delete_folder", async (req, res) => {
    const { folder_id } = req.body;
    const query = [
        "SELECT parent_id FROM voca_folder WHERE folder_id=?;",
        `DELETE FROM voca_data WHERE folder_id=?;
    DELETE FROM voca_file WHERE folder_id=?;
    DELETE FROM voca_folder WHERE folder_id=?;`,
    ];
    const target = [[folder_id], [folder_id, folder_id, folder_id]];
    try {
        const [result1] = await db.query(query[0], target[0]);
        const parent_id = result1[0].parent_id;
        if (parent_id === 0) {
            res.send(["Home 폴더는 삭제하실 수 없습니다", "error", "folder"]);
        }
        else {
            await db.query(query[1], target[1]);
            res.send(["폴더가 삭제되었습니다", "success", "folder", parent_id]);
        }
    }
    catch (err) {
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
    }
    catch (err) {
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
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});
router.post("/user", async (req, res, next) => {
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
        const [result] = await db.query(query[0], target[0]);
        const compareResult = await bcrypt_1.default.compare(password, result[0].password);
        if (compareResult) {
            req.logout(async (err) => {
                if (err) {
                    return next(err);
                }
                await db.query(query[1], target[1]);
                res.send("success");
            });
        }
        else {
            res.send(["비밀번호가 일치하지 않습니다", "warning", "set"]);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});
exports.default = router;
