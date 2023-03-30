"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const promise_1 = __importDefault(require("mysql2/promise"));
const module_1 = __importDefault(require("../lib/module"));
const db = promise_1.default.createPool(require("../lib/config").user);
const router = express_1.default.Router();
router.use(body_parser_1.default.json());
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.post("/create_folder", async (req, res) => {
    const { folder_id, formData } = req.body;
    const { user_id } = req.user[0];
    const query = `INSERT INTO voca_folder(user_id,parent_id,folder_name) VALUES(?,?,?)`;
    const target = [user_id, folder_id, formData.value1];
    try {
        const result = await (0, module_1.default)("folder", folder_id, formData.value1);
        if (!Boolean(result[0])) {
            await db.query(query, target);
            res.send(["폴더가 생성되었습니다", "success", "folder"]);
        }
        else {
            res.send([
                "동일한 폴더명이 해당 폴더 내에 존재합니다",
                "warning",
                "folder",
            ]);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});
router.post("/create_file", async (req, res) => {
    const { folder_id, formData } = req.body;
    const { user_id } = req.user[0];
    const query = `INSERT INTO voca_file(user_id,folder_id,file_name) VALUES(?,?,?)`;
    const target = [user_id, folder_id, formData.value1];
    try {
        const result = await (0, module_1.default)("file", folder_id, formData.value1);
        if (!Boolean(result[0])) {
            await db.query(query, target);
            res.send(["단어장이 생성되었습니다", "success", "file"]);
        }
        else {
            res.send([
                "동일한 단어장명이 해당 폴더 내에 존재합니다",
                "warning",
                "file",
            ]);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});
router.post("/create_data", async (req, res) => {
    const { folder_id, file_id } = req.body;
    const { user_id } = req.user[0];
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
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});
exports.default = router;
