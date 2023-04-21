"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_kakao_1 = require("passport-kakao");
const config_1 = require("../config");
const promise_1 = __importDefault(require("mysql2/promise"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const shortid_1 = __importDefault(require("shortid"));
if (!config_1.kakao.kakao_id || !config_1.kakao.kakao_callback) {
    throw new Error("카카오 로그인 구성요소에 필수 속성이 없습니다.");
}
const db = promise_1.default.createPool(config_1.user);
const verifyCallback = async (accessToken, refreshToken, profile, done) => {
    try {
        const newProfile = { email: profile.id + "@kakao.email" };
        const checked = await db.query("SELECT * FROM localuser WHERE email=?", [
            newProfile.email,
        ]);
        if (checked[0]) {
            return done(null, newProfile);
        }
        else {
            const hashedPassword = await bcrypt_1.default.hash(shortid_1.default.generate(), 10);
            const topics = (await db.query(`INSERT INTO localuser(email, password, nickname) VALUES(?,?,?);
      SELECT user_id FROM localuser WHERE email=?
      `, [
                newProfile.email,
                hashedPassword,
                profile.displayName,
                newProfile.email,
            ]));
            const { user_id } = topics[1][0];
            await db.query("INSERT INTO voca_folder(user_id,folder_name,parent_id) VALUES(?,'Home',0)", [user_id]);
            return done(null, newProfile);
        }
    }
    catch (err) {
        done(err);
    }
};
const kakaoPassport = new passport_kakao_1.Strategy({
    clientID: config_1.kakao.kakao_id,
    callbackURL: config_1.kakao.kakao_callback,
}, verifyCallback);
exports.default = kakaoPassport;
