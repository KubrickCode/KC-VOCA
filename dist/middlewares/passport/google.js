"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../../models/queries/User"));
const config_1 = require("../../shared/config");
const handlePassword_1 = require("../../integrations/handlePassword");
const getRandomPassword_1 = require("../../integrations/getRandomPassword");
const handleLogin_1 = require("../../integrations/handleLogin");
const Redis_1 = require("../../models/Redis");
const googleStrategy = new passport_google_oauth20_1.Strategy(config_1.googleConfig, async (accessToken, refreshToken, profile, done) => {
    try {
        const name = profile.displayName;
        const email = profile._json.email;
        const existingUser = await User_1.default.getUserByEmail(email);
        if (existingUser) {
            const { id } = existingUser;
            const { token, refreshToken } = (0, handleLogin_1.signJWT)({ id, email, nickname: name });
            await (0, Redis_1.storeRefreshToken)(id, refreshToken);
            return done(null, { ...existingUser, token, refreshToken });
        }
        const hashedPassword = await (0, handlePassword_1.hashPassword)((0, getRandomPassword_1.getRandomPassword)());
        await User_1.default.createUser({
            email,
            nickname: name,
            password: hashedPassword,
        });
        const savedUser = await User_1.default.getUserByEmail(email);
        const { id } = savedUser;
        const { token, refreshToken } = (0, handleLogin_1.signJWT)({ id, email, nickname: name });
        await (0, Redis_1.storeRefreshToken)(id, refreshToken);
        done(null, { ...savedUser, token, refreshToken });
    }
    catch (err) {
        done(err);
    }
});
exports.default = googleStrategy;
