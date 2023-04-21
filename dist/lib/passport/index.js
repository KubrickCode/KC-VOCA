"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePassport = void 0;
const passport_1 = __importDefault(require("passport"));
const google_1 = __importDefault(require("./google"));
const kakao_1 = __importDefault(require("./kakao"));
const local_1 = __importDefault(require("./local"));
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = require("../config");
const db = promise_1.default.createPool(config_1.user);
const initializePassport = () => {
    passport_1.default.serializeUser((user, done) => {
        done(null, user.email);
    });
    passport_1.default.deserializeUser(async (email, done) => {
        try {
            const result = await db.query("SELECT user_id FROM localuser WHERE email=?", [email]);
            await done(null, result[0]);
        }
        catch (err) {
            done(err);
        }
    });
    passport_1.default.use(local_1.default);
    passport_1.default.use(google_1.default);
    passport_1.default.use(kakao_1.default);
    return passport_1.default;
};
exports.initializePassport = initializePassport;
