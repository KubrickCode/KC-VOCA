"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const promise_1 = __importDefault(require("mysql2/promise"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = require("../lib/passport");
const config_1 = require("../lib/config");
const dotenv_1 = __importDefault(require("dotenv"));
const isLogin_1 = __importDefault(require("../middlewares/isLogin"));
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const router = express_1.default.Router();
const db = promise_1.default.createPool(config_1.user);
const passport = (0, passport_1.initializePassport)();
dotenv_1.default.config();
const url = process.env.REDIRECT_ROOT ?? "/";
router.use(body_parser_1.default.json());
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.get("/islogin", (0, asyncHandler_1.default)(async (req, res) => {
    res.send(req.user ? true : false);
}));
router.get("/logout", isLogin_1.default, (0, asyncHandler_1.default)(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect(url);
    });
}));
router.post("/check_duplicate", async (req, res, next) => {
    const { email, nickname } = req.body;
    const query = `SELECT * FROM localuser WHERE email = ? OR nickname = ?`;
    const target = [email, nickname];
    try {
        const [results] = await db.query(query, target);
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
        }
        else {
            return res.status(200).send("No duplicates found");
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
});
router.post("/signup_process", async (req, res) => {
    const { email, password, nickname } = req.body;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const query = [
        `INSERT INTO localuser(email, password, nickname) VALUES(?,?,?)`,
        `SELECT user_id FROM localuser WHERE email=?`,
        'INSERT INTO voca_folder(user_id,folder_name,parent_id) VALUES(?,"Home",0)',
    ];
    const target = [[email, hashedPassword, nickname], [email]];
    try {
        await db.query(query[0], target[0]);
        const [result] = await db.query(query[1], target[1]);
        await db.query(query[2], [result[0].user_id]);
        req.login({ email, password, nickname }, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("err");
            }
            res.redirect(url);
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
});
router.post("/login_process", passport.authenticate("local", {
    successRedirect: url,
    failureRedirect: url,
    failureFlash: true,
}));
router.get("/login_process", (0, asyncHandler_1.default)(async (req, res) => {
    const fmsg = req.flash();
    const feedback = fmsg.error ? fmsg.error[0] : "";
    res.json({ feedback });
}));
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", {
    successRedirect: url,
    failureRedirect: url,
}));
router.get("/kakao", passport.authenticate("kakao"));
router.get("/kakao/callback", passport.authenticate("kakao", {
    successRedirect: url,
    failureRedirect: url,
}));
exports.default = router;
