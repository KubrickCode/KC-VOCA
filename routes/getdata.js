const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const db = mysql.createConnection(require("../lib/config").user);
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

module.exports = router;
