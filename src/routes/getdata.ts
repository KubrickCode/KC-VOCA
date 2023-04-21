import express from "express";
import bodyParser from "body-parser";
import mysql, { RowDataPacket } from "mysql2/promise";
import bcrypt from "bcrypt";
import { user as userConfig } from "../lib/config";
import AWS from "aws-sdk";
import { awsConfig } from "../lib/config";
import asyncHandler from "../middlewares/asyncHandler";

const db = mysql.createPool(userConfig);

const router = express.Router();

const Polly = new AWS.Polly({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  signatureVersion: awsConfig.signatureVersion,
  region: awsConfig.region,
});

const SES_CONFIG = {
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.k_region,
};

const AWS_SES = new AWS.SES(SES_CONFIG);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get(
  "/get_folder",
  asyncHandler(async (req, res) => {
    const { user_id } = (req.user as { user_id: number }[])[0];
    const query = `SELECT * FROM voca_folder WHERE user_id=?`;
    const target = [user_id];
    const [result] = await db.query(query, target);
    res.json(result);
  })
);

router.get(
  "/get_file/:id",
  asyncHandler(async (req, res) => {
    const folder_id = req.params.id;
    const { user_id } = (req.user as { user_id: number }[])[0];

    if (folder_id === "get_recent_file") {
      const query = `SELECT * FROM voca_file WHERE user_id=? ORDER BY current DESC;`;
      const target = [user_id];
      const [result] = await db.query<RowDataPacket[]>(query, target);
      res.json(result.slice(0, 10));
    } else if (folder_id === "get_fav_file") {
      const query = `SELECT * FROM voca_file WHERE favorites=1 AND user_id=?`;
      const target = [user_id];
      const [result] = await db.query(query, target);
      res.json(result);
    } else if (folder_id === "get_share_file") {
      const query = `SELECT v.*, u.nickname
      FROM voca_file v
      JOIN localuser u ON v.user_id = u.user_id
      WHERE v.shared = 1;`;
      const [result] = await db.query(query);
      res.json(result);
    } else {
      const query = `SELECT * FROM voca_file WHERE folder_id=?`;
      const target = [folder_id];
      const [result] = await db.query(query, target);
      res.json(result);
    }
  })
);

router.get(
  "/get_fav_file",
  asyncHandler(async (req, res) => {
    const { user_id } = (req.user as { user_id: number }[])[0];
    const query = `SELECT * FROM voca_file WHERE favorites=1 AND user_id=?`;
    const target = [user_id];
    const [result] = await db.query(query, target);
    res.json(result);
  })
);

router.get(
  "/get_recent_file",
  asyncHandler(async (req, res) => {
    const { user_id } = (req.user as { user_id: number }[])[0];
    const query = `SELECT * FROM voca_file WHERE user_id=? ORDER BY current DESC;`;
    const target = [user_id];
    const [result] = await db.query<RowDataPacket[]>(query, target);
    res.json(result.slice(0, 10));
  })
);

router.get(
  "/get_share_file",
  asyncHandler(async (req, res) => {
    const query = `SELECT v.*, u.nickname
    FROM voca_file v
    JOIN localuser u ON v.user_id = u.user_id
    WHERE v.shared = 1;`;
    const [result] = await db.query(query);
    res.json(result);
  })
);

router.get("/get_data/:id", async (req, res) => {
  const file_id = req.params.id;
  const { user_id } = (req.user as { user_id: number }[])[0];

  const query = [
    "SELECT * FROM voca_data WHERE file_id=?",
    "SELECT * FROM voca_file WHERE file_id=?",
    "UPDATE voca_file SET current=CURRENT_TIMESTAMP WHERE file_id=?",
  ];
  const target = [file_id];

  try {
    const [data, file] = await Promise.all([
      db.query<RowDataPacket[]>(query[0], target),
      db.query<RowDataPacket[]>(query[1], target),
    ]);

    await db.query(query[2], target);

    if (file[0][0] && file[0][0].user_id !== user_id) {
      res.json([data[0], file[0], true]);
    } else {
      res.json(file[0][0] ? [data[0], file[0]] : false);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.get(
  "/user",
  asyncHandler(async (req, res) => {
    if (!req.user) {
      res.send(false);
      return;
    }
    const { user_id } = (req.user as { user_id: number }[])[0];

    const query = `SELECT * FROM localuser WHERE user_id=?`;
    const target = [user_id];
    const [result] = await db.query<RowDataPacket[]>(query, target);
    res.send(result[0]);
  })
);

router.post(
  "/tts",
  asyncHandler(async (req, res) => {
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
  })
);

router.post(
  "/search",
  asyncHandler(async (req, res) => {
    const { word } = req.body;
    const { user_id } = (req.user as { user_id: number }[])[0];
    const query = `SELECT * FROM voca_data WHERE voca REGEXP ? AND voca_data.user_id=? OR voca_mean REGEXP ? AND voca_data.user_id=?`;
    const target = [word, user_id, word, user_id];
    const [result] = await db.query(query, target);
    res.send(result);
  })
);

router.post(
  "/find_password",
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const query = [
      "SELECT email FROM localuser WHERE email=?",
      "UPDATE localuser SET password=? WHERE email=?",
    ];
    const isExist = await db.query<RowDataPacket[]>(query[0], [email]);
    if (Boolean(isExist[0][0].email)) {
      const newPassword = Math.random().toString(36).slice(2);
      const hash = await bcrypt.hash(newPassword, 10);
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
  })
);

export default router;
