"use strict";
module.exports = () => {
    const express = require("express");
    const app = express();
    const passport = require("passport");
    const LocalStrategy = require("passport-local").Strategy;
    const GoogleStrategy = require("passport-google-oauth2").Strategy;
    const KakaoStrategy = require("passport-kakao").Strategy;
    const mysql = require("mysql");
    const db = mysql.createConnection(require("../lib/config").user);
    const cookieParser = require("cookie-parser");
    const bcrypt = require("bcrypt");
    const shortid = require("shortid");
    const flash = require("connect-flash");
    const google = require("./config").google;
    const kakao = require("./config").kakao;
    db.connect();
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    passport.serializeUser((user, done) => {
        done(null, user.email);
    });
    passport.deserializeUser((email, done) => {
        db.query(`SELECT user_id FROM localuser WHERE email=?`, [email], (err, results) => {
            done(null, results);
        });
    });
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
    }, (email, password, done) => {
        db.query(`SELECT user_id, email, password FROM localuser WHERE email=?`, [email], (err, topics) => {
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
        });
    }));
    passport.use(new GoogleStrategy({
        clientID: google.google_id,
        clientSecret: google.google_secret,
        callbackURL: google.google_callback,
        passReqToCallback: true,
    }, (request, accessToken, refreshToken, profile, done) => {
        db.query(`SELECT * FROM localuser WHERE email=?
        `, [profile.email], (err, result) => {
            if (result[0]) {
                return done(null, profile);
            }
            else {
                bcrypt.hash(shortid.generate(), 10, (err, hash) => {
                    db.query(`INSERT INTO localuser(email, password, nickname) VALUES(?,?,?);
                      SELECT user_id FROM localuser WHERE email=?
                      `, [profile.email, hash, profile.displayName, profile.email], (err, topics) => {
                        const uid = topics[1][0].user_id;
                        db.query(`
                          INSERT INTO voca_folder(user_id,folder_name,parent_id) VALUES(?,'Home',0);
                          `, [uid], (err, result) => {
                            return done(null, profile);
                        });
                    });
                });
            }
        });
    }));
    passport.use(new KakaoStrategy({
        clientID: kakao.kakao_id,
        callbackURL: kakao.kakao_callback,
    }, (accessToken, refreshToken, profile, done) => {
        const newprofile = { email: profile.id + "@kakao.email" };
        db.query(`SELECT * FROM localuser WHERE email=?
        `, [newprofile.email], (err, result) => {
            if (result[0]) {
                return done(null, newprofile);
            }
            else {
                bcrypt.hash(shortid.generate(), 10, (err, hash) => {
                    db.query(`INSERT INTO localuser(email, password, nickname) VALUES(?,?,?);
                      SELECT user_id FROM localuser WHERE email=?
                      `, [
                        newprofile.email,
                        hash,
                        profile.displayName,
                        newprofile.email,
                    ], (err, topics) => {
                        const uid = topics[1][0].user_id;
                        db.query(`
                          INSERT INTO voca_folder(user_id,folder_name,parent_id) VALUES(?,'Home',0);
                          `, [uid], (err, result) => {
                            return done(null, newprofile);
                        });
                    });
                });
            }
        });
    }));
    return passport;
};
