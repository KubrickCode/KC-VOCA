const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const db = mysql.createPool(require("../lib/config").user);
const AWS = require("aws-sdk");
const aws_info = require("../lib/config").aws;
const bcrypt = require("bcrypt");

const Polly = new AWS.Polly({
  accessKeyId: aws_info.accessKeyId,
  secretAccessKey: aws_info.secretAccessKey,
  signatureVersion: aws_info.signatureVersion,
  region: aws_info.region,
});

const SES_CONFIG = {
  accessKeyId: aws_info.accessKeyId,
  secretAccessKey: aws_info.secretAccessKey,
  region: aws_info.k_region,
};

const AWS_SES = new AWS.SES(SES_CONFIG);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/get_folder", async (req, res) => {
  const { user_id } = req.user[0];
  const query = `SELECT * FROM voca_folder WHERE user_id=?`;
  const target = [user_id];
  try {
    const [result] = await db.query(query, target);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/get_file", async (req, res) => {
  const { folder_id } = req.body;
  const query = `SELECT * FROM voca_file WHERE folder_id=?`;
  const target = [folder_id];
  try {
    const [result] = await db.query(query, target);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.get("/get_fav_file", async (req, res) => {
  const { user_id } = req.user[0];
  const query = `SELECT * FROM voca_file WHERE favorites=1 AND user_id=?`;
  const target = [user_id];
  try {
    const [result] = await db.query(query, target);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.get("/get_recent_file", async (req, res) => {
  const { user_id } = req.user[0];
  const query = `SELECT * FROM voca_file WHERE user_id=? ORDER BY current DESC;`;
  const target = [user_id];
  try {
    const [result] = await db.query(query, target);
    res.json(result.slice(0, 10));
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.get("/get_share_file", async (req, res) => {
  const query = `SELECT v.*, u.nickname
  FROM voca_file v
  JOIN localuser u ON v.user_id = u.user_id
  WHERE v.shared = 1;`;
  try {
    const [result] = await db.query(query);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/get_data", async (req, res) => {
  const { file_id } = req.body;
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
      file[0].push(true);
    }

    res.json(file[0][0] ? [data[0], file[0]] : false);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.get("/user", async (req, res) => {
  const { user_id } = req.user[0];
  const query = `SELECT * FROM localuser WHERE user_id=?`;
  const target = [user_id];
  try {
    const [result] = await db.query(query, target);
    res.send(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/tts", async (req, res) => {
  const { text } = req.body;
  const params = {
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Matthew",
  };

  try {
    const data = await Polly.synthesizeSpeech(params).promise();
    if (data?.AudioStream instanceof Buffer) {
      res.send(data.AudioStream);
    }
  } catch (err) {
    console.log(err.code);
    res.status(500).send("Internal server error");
  }
});

router.post("/search", async (req, res) => {
  const { word } = req.body;
  const { user_id } = req.user[0];
  const query = `SELECT * FROM voca_data WHERE voca REGEXP ? AND voca_data.user_id=? OR voca_mean REGEXP ? AND voca_data.user_id=?`;
  const target = [word, user_id, word, user_id];
  try {
    const [result] = await db.query(query, target);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/find_password", async (req, res) => {
  const { email } = req.body;
  const query = [
    "SELECT email FROM localuser WHERE email=?",
    "UPDATE localuser SET password=? WHERE email=?",
  ];
  try {
    const isExist = await db.query(query[0], [email]);
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
  } catch (err) {
    console.error(err);
    res.send(false);
  }
});

module.exports = router;
