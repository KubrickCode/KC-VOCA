"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.changePassword = exports.changeNickname = exports.getUser = void 0;
const user_service_1 = require("../services/user.service");
const getUser = async (req, res) => {
    const { id: user_id } = req.user;
    const { id, email, nickname, registration_date } = await (0, user_service_1.getUserService)(Number(user_id));
    res.status(200).json({ id, email, nickname, registration_date });
};
exports.getUser = getUser;
const changeNickname = async (req, res) => {
    const { nickname } = req.body;
    const { id } = req?.user;
    const result = await (0, user_service_1.changeNicknameService)(Number(id), nickname);
    if (result) {
        const { message } = result;
        res.status(403).json({ message });
    }
    else {
        res.status(204).send();
    }
};
exports.changeNickname = changeNickname;
const changePassword = async (req, res) => {
    const { password, prevPassword } = req.body;
    const { id } = req?.user;
    const result = await (0, user_service_1.changePasswordService)(Number(id), password, prevPassword);
    if (result) {
        const { message } = result;
        res.status(403).json({ message });
    }
    else {
        res.status(204).send();
    }
};
exports.changePassword = changePassword;
const deleteUser = async (req, res) => {
    const { id } = req?.user;
    const { password } = req.body;
    const result = await (0, user_service_1.deleteUserService)(id, password);
    if (result) {
        res.status(204).send();
    }
    else {
        res.status(403).json({ message: "비밀번호를 확인해주세요" });
    }
};
exports.deleteUser = deleteUser;
