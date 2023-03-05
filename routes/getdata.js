const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const db = mysql.createConnection(require("../lib/config").user);
const AWS = require("aws-sdk");
const aws_info = require("../lib/config").aws;

const Polly = new AWS.Polly({
  accessKeyId: aws_info.accessKeyId,
  secretAccessKey: aws_info.secretAccessKey,
  signatureVersion: aws_info.signatureVersion,
  region: aws_info.region,
});

db.connect();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/get_folder", (req, res) => {
  db.query(
    `SELECT * FROM voca_folder WHERE user_id=?`,
    [req.user[0].user_id],
    (err, result) => {
      res.json(result);
    }
  );
});

router.post("/get_file", (req, res) => {
  const post = req.body;
  db.query(
    `
  SELECT * FROM voca_file WHERE folder_id=?
  `,
    [post.folder_id],
    (err, result) => {
      res.json(result);
    }
  );
});

router.get("/get_fav_file", (req, res) => {
  db.query(
    `
  SELECT * FROM voca_file WHERE favorites=1 AND user_id=?
  `,
    [req.user[0].user_id],
    (err, result) => {
      res.json(result);
    }
  );
});

router.get("/get_recent_file", (req, res) => {
  db.query(
    `SELECT * FROM voca_file WHERE user_id=? ORDER BY current DESC;`,
    [req.user[0].user_id],
    (err, result) => {
      res.json(result.slice(0, 10));
    }
  );
});

router.get("/get_share_file", (req, res) => {
  db.query(
    `
    SELECT v.*, u.nickname
    FROM voca_file v
    JOIN localuser u ON v.user_id = u.user_id
    WHERE v.shared = 1;
    
  `,
    (err, result) => {
      res.json(result);
    }
  );
});

router.post("/get_data", (req, res) => {
  const post = req.body;
  const user_id = req.user[0].user_id;

  db.query(
    `
  SELECT * FROM voca_data WHERE file_id=?;
  SELECT * FROM voca_file WHERE file_id=?
  `,
    [post.file_id, post.file_id],
    (err, result) => {
      if (result[1][0] && result[1][0].user_id === user_id) {
        res.json(result);
      } else if (result[1][0] && result[1][0].user_id !== user_id) {
        result.push(true);
        res.json(result);
      } else {
        res.json(false);
      }
    }
  );
});

router.get("/user", (req, res) => {
  const user = req.user[0];
  db.query(
    `SELECT * FROM localuser WHERE user_id=?`,
    [user.user_id],
    (err, result) => {
      res.send(result[0]);
    }
  );
});

router.post("/tts", (req, res) => {
  const post = req.body;
  const params = {
    Text: post.text,
    OutputFormat: "mp3",
    VoiceId: "Matthew",
  };
  Polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      console.log(err.code);
    } else if (data?.AudioStream instanceof Buffer) {
      res.send(data.AudioStream);
    }
  });
});

router.post("/search", (req, res) => {
  const post = req.body;
  const user = req.user[0];
  db.query(
    `SELECT * FROM voca_data WHERE voca REGEXP ? AND voca_data.user_id=? OR voca_mean REGEXP ? AND voca_data.user_id=?;
  `,
    [post.word, user.user_id, post.word, user.user_id],
    (err, result) => {
      res.send(result);
    }
  );
});

module.exports = router;
