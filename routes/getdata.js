const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const db = mysql.createPool(require("../lib/config").user);
const AWS = require("aws-sdk");
const aws_info = require("../lib/config").aws;

const Polly = new AWS.Polly({
  accessKeyId: aws_info.accessKeyId,
  secretAccessKey: aws_info.secretAccessKey,
  signatureVersion: aws_info.signatureVersion,
  region: aws_info.region,
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/get_folder", async (req, res) => {
  try {
    const [result] = await db.query(
      `SELECT * FROM voca_folder WHERE user_id=?`,
      [req.user[0].user_id]
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/get_file", async (req, res) => {
  const post = req.body;
  try {
    const [result] = await db.query(
      `SELECT * FROM voca_file WHERE folder_id=?`,
      [post.folder_id]
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.get("/get_fav_file", async (req, res) => {
  try {
    const [result] = await db.query(
      `SELECT * FROM voca_file WHERE favorites=1 AND user_id=?`,
      [req.user[0].user_id]
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.get("/get_recent_file", async (req, res) => {
  try {
    const [result] = await db.query(
      `SELECT * FROM voca_file WHERE user_id=? ORDER BY current DESC;`,
      [req.user[0].user_id]
    );
    res.json(result.slice(0, 10));
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.get("/get_share_file", async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT v.*, u.nickname
      FROM voca_file v
      JOIN localuser u ON v.user_id = u.user_id
      WHERE v.shared = 1;
    `);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/get_data", async (req, res) => {
  const { file_id } = req.body;
  const user_id = req.user[0].user_id;

  try {
    const [data, file] = await Promise.all([
      db.query("SELECT * FROM voca_data WHERE file_id=?", [file_id]),
      db.query("SELECT * FROM voca_file WHERE file_id=?", [file_id]),
    ]);

    await db.query(
      "UPDATE voca_file SET current=CURRENT_TIMESTAMP WHERE file_id=?",
      [file_id]
    );

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
  const user = req.user[0];
  try {
    const [result] = await db.query(`SELECT * FROM localuser WHERE user_id=?`, [
      user.user_id,
    ]);
    res.send(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/tts", async (req, res) => {
  const post = req.body;
  const params = {
    Text: post.text,
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
  const post = req.body;
  const user = req.user[0];
  try {
    const [result] = await db.query(
      `
      SELECT * FROM voca_data WHERE voca REGEXP ? AND voca_data.user_id=? OR voca_mean REGEXP ? AND voca_data.user_id=?;
    `,
      [post.word, user.user_id, post.word, user.user_id]
    );
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
