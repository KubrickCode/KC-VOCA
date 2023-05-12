"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserService = exports.changePasswordService = exports.changeNicknameService = exports.getUserService = void 0;
const User_1 = __importDefault(require("../models/queries/User"));
const getUserService = async (user_id) => {
    const [user] = await User_1.default.getUserById(user_id);
    const { id, email, nickname, registration_date } = user;
    return { id, email, nickname, registration_date };
};
exports.getUserService = getUserService;
const changeNicknameService = async (id, nickname) => {
    const result = await User_1.default.checkNickname(nickname);
    if (result) {
        await User_1.default.changeNickname(id, nickname);
    }
    else {
        return { message: "이미 존재하는 닉네임입니다" };
    }
};
exports.changeNicknameService = changeNicknameService;
const changePasswordService = async (id, password, prevPassword) => {
    const result = await User_1.default.checkPassword(id, prevPassword);
    if (result) {
        await User_1.default.changePassword(id, password);
    }
    else {
        return { message: "기존 비밀번호를 확인해주세요" };
    }
};
exports.changePasswordService = changePasswordService;
const deleteUserService = async (id, password) => {
    const result = await User_1.default.checkPassword(id, password);
    if (result) {
        await User_1.default.deleteUser(id);
        return true;
    }
    else {
        return false;
    }
};
exports.deleteUserService = deleteUserService;
