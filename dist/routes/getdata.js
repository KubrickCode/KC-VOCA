"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const promise_1 = __importDefault(require("mysql2/promise"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../lib/config");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_2 = require("../lib/config");
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const db = promise_1.default.createPool(config_1.user);
const router = express_1.default.Router();
const Polly = new aws_sdk_1.default.Polly({
    accessKeyId: config_2.awsConfig.accessKeyId,
    secretAccessKey: config_2.awsConfig.secretAccessKey,
    signatureVersion: config_2.awsConfig.signatureVersion,
    region: config_2.awsConfig.region,
});
const SES_CONFIG = {
    accessKeyId: config_2.awsConfig.accessKeyId,
    secretAccessKey: config_2.awsConfig.secretAccessKey,
    region: config_2.awsConfig.k_region,
};
const AWS_SES = new aws_sdk_1.default.SES(SES_CONFIG);
router.use(body_parser_1.default.json());
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.get("/get_folder", (0, asyncHandler_1.default)(async (req, res) => {
    const { user_id } = req.user[0];
    const query = `SELECT * FROM voca_folder WHERE user_id=?`;
    const target = [user_id];
    const [result] = await db.query(query, target);
    res.json(result);
}));
router.get("/get_file/:id", (0, asyncHandler_1.default)(async (req, res) => {
    const folder_id = req.params.id;
    const { user_id } = req.user[0];
    if (folder_id === "get_recent_file") {
        const query = `SELECT * FROM voca_file WHERE user_id=? ORDER BY current DESC;`;
        const target = [user_id];
        const [result] = await db.query(query, target);
        res.json(result.slice(0, 10));
    }
    else if (folder_id === "get_fav_file") {
        const query = `SELECT * FROM voca_file WHERE favorites=1 AND user_id=?`;
        const target = [user_id];
        const [result] = await db.query(query, target);
        res.json(result);
    }
    else if (folder_id === "get_share_file") {
        const query = `SELECT v.*, u.nickname
      FROM voca_file v
      JOIN localuser u ON v.user_id = u.user_id
      WHERE v.shared = 1;`;
        const [result] = await db.query(query);
        res.json(result);
    }
    else {
        const query = `SELECT * FROM voca_file WHERE folder_id=?`;
        const target = [folder_id];
        const [result] = await db.query(query, target);
        res.json(result);
    }
}));
router.get("/get_fav_file", (0, asyncHandler_1.default)(async (req, res) => {
    const { user_id } = req.user[0];
    const query = `SELECT * FROM voca_file WHERE favorites=1 AND user_id=?`;
    const target = [user_id];
    const [result] = await db.query(query, target);
    res.json(result);
}));
router.get("/get_recent_file", (0, asyncHandler_1.default)(async (req, res) => {
    const { user_id } = req.user[0];
    const query = `SELECT * FROM voca_file WHERE user_id=? ORDER BY current DESC;`;
    const target = [user_id];
    const [result] = await db.query(query, target);
    res.json(result.slice(0, 10));
}));
router.get("/get_share_file", (0, asyncHandler_1.default)(async (req, res) => {
    const query = `SELECT v.*, u.nickname
    FROM voca_file v
    JOIN localuser u ON v.user_id = u.user_id
    WHERE v.shared = 1;`;
    const [result] = await db.query(query);
    res.json(result);
}));
router.get("/get_data/:id", async (req, res) => {
    const file_id = req.params.id;
    const { user_id } = req.user[0];
    const query = [
        "SELECT * FROM voca_data WHERE file_id=?",
        "SELECT * FROM voca_file WHERE file_id=?",
        "UPDATE voca_file SET current=CURRENT_TIMESTAMP WHERE file_id=?",
    ];
    const target = [file_id];
    try {
        const [data, file] = await Promise.all([
            db.query(query[0], target),
            db.query(query[1], target),
        ]);
        await db.query(query[2], target);
        if (file[0][0] && file[0][0].user_id !== user_id) {
            res.json([data[0], file[0], true]);
        }
        else {
            res.json(file[0][0] ? [data[0], file[0]] : false);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});
router.get("/user", (0, asyncHandler_1.default)(async (req, res) => {
    if (!req.user) {
        res.send(false);
        return;
    }
    const { user_id } = req.user[0];
    const query = `SELECT * FROM localuser WHERE user_id=?`;
    const target = [user_id];
    const [result] = await db.query(query, target);
    res.send(result[0]);
}));
router.post("/tts", (0, asyncHandler_1.default)(async (req, res) => {
    const { text } = req.body;
    const params = {
        Text: text,
        OutputFormat: "mp3",
        VoiceId: "Matthew",
    };
    const data = await Polly.synthesizeSpeech(params).promise();
    if (data?.AudioStream instanceof Buffer) {
        res.send(data.AudioStream);
    }
}));
router.post("/search", (0, asyncHandler_1.default)(async (req, res) => {
    const { word } = req.body;
    const { user_id } = req.user[0];
    const query = `SELECT * FROM voca_data WHERE voca REGEXP ? AND voca_data.user_id=? OR voca_mean REGEXP ? AND voca_data.user_id=?`;
    const target = [word, user_id, word, user_id];
    const [result] = await db.query(query, target);
    res.send(result);
}));
router.post("/find_password", (0, asyncHandler_1.default)(async (req, res) => {
    const { email } = req.body;
    const query = [
        "SELECT email FROM localuser WHERE email=?",
        "UPDATE localuser SET password=? WHERE email=?",
    ];
    const isExist = await db.query(query[0], [email]);
    if (Boolean(isExist[0][0].email)) {
        const newPassword = Math.random().toString(36).slice(2);
        const hash = await bcrypt_1.default.hash(newPassword, 10);
        await db.query(query[1], [hash, email]);
        let params = {
            Source: "kcvoca2023@gmail.com",
            Destination: {
                ToAddresses: [email],
            },
            ReplyToAddresses: [],
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `
            새로 발급된 임시비밀번호 : ' ${newPassword} '
            로그인 후 비밀번호를 꼭 변경해주세요.
            `,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `kcvoca에서의 새 비밀번호를 확인해 주세요`,
                },
            },
        };
        AWS_SES.sendEmail(params).promise();
        res.send(true);
    }
}));
exports.default = router;
