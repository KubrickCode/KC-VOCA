"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kakaoCallback = exports.kakaoLogin = exports.googleCallback = exports.googleLogin = exports.findPassword = exports.addUser = exports.refreshToken = exports.login = void 0;
const handleLogin_1 = require("../integrations/handleLogin");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_service_1 = require("../services/auth.service");
const auth_service_2 = require("./../services/auth.service");
dotenv_1.default.config();
const login = async (req, res) => {
    const { email, password } = req.body;
    const result = await (0, auth_service_1.loginService)(email, password);
    res.status(201).json({ result });
};
exports.login = login;
const refreshToken = async (req, res) => {
    const newToken = await (0, auth_service_1.refreshTokenService)(req.headers["x-refresh-token"]);
    if (!newToken) {
        return res.status(401).json({ message: "리프레쉬 토큰이 만료되었습니다" });
    }
    res.json({ token: newToken });
};
exports.refreshToken = refreshToken;
const addUser = async (req, res) => {
    const { email, nickname, password } = req.body;
    const token = await (0, auth_service_1.addUserService)(email, nickname, password);
    res.status(201).json({ token });
};
exports.addUser = addUser;
const findPassword = async (req, res) => {
    const { email } = req.body;
    const result = await (0, auth_service_2.findPasswordService)(email);
    if (!result) {
        res.status(404).json({ message: "존재하지 않는 계정입니다" });
    }
    else {
        res.status(204).send();
    }
};
exports.findPassword = findPassword;
const googleLogin = async (req, res, next) => {
    (0, handleLogin_1.googleAuthenticate)()(req, res, next);
};
exports.googleLogin = googleLogin;
const googleCallback = async (req, res, next) => {
    const { token } = (await (0, handleLogin_1.googleCallbackAuthenticate)(req, res, next));
    res
        .status(303)
        .redirect(`${process.env.REDIRECT_ROOT}/authorize?token=${token}`);
};
exports.googleCallback = googleCallback;
const kakaoLogin = async (req, res, next) => {
    (0, handleLogin_1.kakaoAuthenticate)()(req, res, next);
};
exports.kakaoLogin = kakaoLogin;
const kakaoCallback = async (req, res, next) => {
    const { token } = (await (0, handleLogin_1.kakaoCallbackAuthenticate)(req, res, next));
    res
        .status(303)
        .redirect(`${process.env.REDIRECT_ROOT}/authorize?token=${token}`);
};
exports.kakaoCallback = kakaoCallback;
