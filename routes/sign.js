const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const passport = require("../lib/passport")();
const db = mysql.createPool(require("../lib/config").user);
require("dotenv").config();

const url = process.env.REDIRECT_ROOT;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/islogin", (req, res) => {
  res.send(req.user ? true : false);
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(url);
  });
});

router.post("/check_duplicate", async (req, res) => {
  const { email, nickname } = req.body;
  try {
    const [results] = await db.query(
      "SELECT * FROM localuser WHERE email = ? OR nickname = ?",
      [email, nickname]
    );

    if (results.length > 0) {
      const duplicates = { email: false, nickname: false };
      for (const user of results) {
        if (user.email === email) {
          duplicates.email = true;
        }
        if (user.nickname === nickname) {
          duplicates.nickname = true;
        }
      }
      return res.status(400).send({ duplicates });
    } else {
      return res.status(200).send("No duplicates found");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

router.post("/signup_process", async (req, res) => {
  const { email, password, nickname } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.query(
      `INSERT INTO localuser(email, password, nickname) VALUES(?,?,?)`,
      [email, hashedPassword, nickname]
    );

    const [result] = await db.query(
      `SELECT user_id FROM localuser WHERE email=?`,
      [email]
    );
    await db.query(
      'INSERT INTO voca_folder(user_id,folder_name,parent_id) VALUES(?,"Home",0)',
      [result[0].user_id]
    );

    req.login({ email, password, nickname }, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("err");
      }
      res.redirect(url);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("err");
  }
});

router.post(
  "/login_process",
  passport.authenticate("local", {
    successRedirect: url,
    failureRedirect: url,
    failureFlash: true,
  })
);

router.get("/login_process", (req, res) => {
  const fmsg = req.flash();
  const feedback = fmsg.error ? fmsg.error[0] : "";
  res.json({ feedback });
});
module.exports = router;

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: url,
    failureRedirect: url,
  })
);

router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    successRedirect: url,
    failureRedirect: url,
  })
);
