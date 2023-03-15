const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const passport = require("../lib/passport")();
const db = mysql.createConnection(require("../lib/config").user);
db.connect();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config();

const url = process.env.REDIRECT_ROOT;

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

router.post("/check_duplicate", (req, res) => {
  const { email, nickname } = req.body;

  db.query(
    "SELECT * FROM localuser WHERE email = ? OR nickname = ?",
    [email, nickname],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
      }

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
    }
  );
});

router.post("/signup_process", async (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    await db.query(
      `INSERT INTO localuser(email, password, nickname) VALUES(?,?,?)`,
      [email, hashedPassword, nickname]
    );

    // Get the user ID of the newly inserted user
    await db.query(
      `SELECT user_id FROM localuser WHERE email=?`,
      [email],
      (err, result) => {
        db.query(
          'INSERT INTO voca_folder(user_id,folder_name,parent_id) VALUES(?,"Home",0)',
          [result[0].user_id]
        );
      }
    );

    // Log in the user and redirect to the login page
    await req.login({ email, password, nickname }, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("err");
      }
      const body = `
        <form name="direction" id="formid" action="/api/signpage/login_process" method="post">
          <input type='hidden' name='email' value='${email}' />
          <input type='hidden' name='password' value='${password}' />
        </form>
        <script>
          document.getElementById("formid").submit();
        </script>
      `;
      return res.send(body);
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
