"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_kakao_1 = require("passport-kakao");
const User_1 = __importDefault(require("../../models/queries/User"));
const config_1 = require("../../shared/config");
const dotenv_1 = __importDefault(require("dotenv"));
const handlePassword_1 = require("../../integrations/handlePassword");
const getRandomPassword_1 = require("../../integrations/getRandomPassword");
const handleLogin_1 = require("../../integrations/handleLogin");
dotenv_1.default.config();
const kakaoStrategy = new passport_kakao_1.Strategy(config_1.kakaoConfig, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.id + "@kakao.email";
        const displayName = profile.displayName;
        const existingUser = await User_1.default.getUserByEmail(email);
        if (existingUser) {
            const { id } = existingUser;
            const token = (0, handleLogin_1.signJWT)({ id, email, nickname: displayName });
            return done(null, { ...existingUser, token });
        }
        const hashedPassword = await (0, handlePassword_1.hashPassword)((0, getRandomPassword_1.getRandomPassword)());
        await User_1.default.createUser({
            email,
            nickname: displayName,
            password: hashedPassword,
        });
        const savedUser = await User_1.default.getUserByEmail(email);
        const { id } = savedUser;
        const token = (0, handleLogin_1.signJWT)({ id, email, nickname: displayName });
        done(null, { ...savedUser, token });
    }
    catch (err) {
        done(err);
    }
});
exports.default = kakaoStrategy;
