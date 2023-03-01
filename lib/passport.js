module.exports = () => {
  const express = require("express");
  const app = express();
  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;
  const mysql = require("mysql");
  const db = mysql.createConnection(require("../lib/config").user);
  const cookieParser = require("cookie-parser");
  const bcrypt = require("bcrypt");
  const flash = require("connect-flash");

  db.connect();

  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser((email, done) => {
    db.query(
      `SELECT user_id FROM localuser WHERE email=?`,
      [email],
      (err, results) => {
        done(null, results);
      }
    );
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      (email, password, done) => {
        db.query(
          `SELECT user_id, email, password FROM localuser WHERE email=?`,
          [email],
          (err, topics) => {
            if (err) {
              return done(err);
            }
            if (!topics.length) {
              return done(null, false, { message: "이메일을 확인해 주세요" });
            }
            const user = topics[0];
            bcrypt.compare(password, user.password, (err, result) => {
              if (err) {
                return done(err);
              }
              if (result) {
                return done(null, user);
              }
              return done(null, false, {
                message: "비밀번호를 확인해 주세요",
              });
            });
          }
        );
      }
    )
  );

  return passport;
};
