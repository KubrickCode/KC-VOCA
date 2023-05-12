"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kakaoCallbackAuthenticate = exports.kakaoAuthenticate = exports.googleCallbackAuthenticate = exports.googleAuthenticate = exports.loginAuthenticate = exports.signJWT = void 0;
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signJWT = (payload) => {
    const secret = process.env.JWT_SECRET;
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: "30d",
    });
    return token;
};
exports.signJWT = signJWT;
const loginAuthenticate = (email, password) => {
    return new Promise((resolve, reject) => {
        passport_1.default.authenticate("local", { session: false }, (err, user, info) => {
            if (err) {
                reject(err);
            }
            else if (!user) {
                resolve({ message: info.message });
            }
            else {
                const { id, email, nickname } = user;
                const payload = { id, email, nickname };
                const token = (0, exports.signJWT)(payload);
                resolve(token);
            }
        })({ body: { email, password } });
    });
};
exports.loginAuthenticate = loginAuthenticate;
const googleAuthenticate = () => {
    return passport_1.default.authenticate("google", { scope: ["email", "profile"] });
};
exports.googleAuthenticate = googleAuthenticate;
const googleCallbackAuthenticate = (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport_1.default.authenticate("google", { session: false }, (err, user, info, status) => {
            if (err) {
                reject(err.message);
            }
            resolve(user);
        })(req, res, next);
    });
};
exports.googleCallbackAuthenticate = googleCallbackAuthenticate;
const kakaoAuthenticate = () => {
    return passport_1.default.authenticate("kakao");
};
exports.kakaoAuthenticate = kakaoAuthenticate;
const kakaoCallbackAuthenticate = (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport_1.default.authenticate("kakao", { session: false }, (err, user) => {
            if (err) {
                reject(err.message);
            }
            resolve(user);
        })(req, res, next);
    });
};
exports.kakaoCallbackAuthenticate = kakaoCallbackAuthenticate;
