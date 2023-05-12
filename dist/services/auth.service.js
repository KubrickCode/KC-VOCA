"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPasswordService = exports.addUserService = exports.loginService = void 0;
const handlePassword_1 = require("../integrations/handlePassword");
const handleLogin_1 = require("../integrations/handleLogin");
const User_1 = __importDefault(require("../models/queries/User"));
const getRandomPassword_1 = require("../integrations/getRandomPassword");
const mailService_1 = require("../integrations/mailService");
const loginService = async (email, password) => {
    return await (0, handleLogin_1.loginAuthenticate)(email, password);
};
exports.loginService = loginService;
const addUserService = async (email, nickname, password) => {
    const hashedPassword = await (0, handlePassword_1.hashPassword)(password);
    await User_1.default.createUser({
        email,
        nickname,
        password: hashedPassword,
    });
    return await (0, handleLogin_1.loginAuthenticate)(email, password);
};
exports.addUserService = addUserService;
const findPasswordService = async (email) => {
    const userInfo = await User_1.default.getUserByEmail(email);
    if (!userInfo) {
        return false;
    }
    else {
        const randomPassword = (0, getRandomPassword_1.getRandomPassword)();
        await User_1.default.changePassword(userInfo.id, randomPassword);
        await (0, mailService_1.mailService)(email, randomPassword);
        return true;
    }
};
exports.findPasswordService = findPasswordService;
