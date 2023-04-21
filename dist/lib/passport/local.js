"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local");
const config_1 = require("../config");
const promise_1 = __importDefault(require("mysql2/promise"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db = promise_1.default.createPool(config_1.user);
const verifyCallback = async (email, password, done) => {
    try {
        const [userRecords] = await db.query(`SELECT user_id, email, password FROM localuser WHERE email=?`, [email]);
        if (!userRecords.length) {
            return done(null, false, { message: "이메일을 확인해 주세요" });
        }
        const user = userRecords[0];
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (passwordMatch) {
            return done(null, user);
        }
        else {
            return done(null, false, {
                message: "비밀번호를 확인해 주세요",
            });
        }
    }
    catch (err) {
        done(err);
    }
};
const localPassport = new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, verifyCallback);
exports.default = localPassport;
