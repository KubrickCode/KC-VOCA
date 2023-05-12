"use strict";
//담당 : 이승현
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local");
const User_1 = __importDefault(require("../../models/queries/User"));
const handlePassword_1 = require("./../../integrations/handlePassword");
const verifyCallback = async (email, password, done) => {
    try {
        const user = await User_1.default.getUserByEmail(email);
        if (!user) {
            return done(null, false, { message: "존재하지 않는 계정입니다" });
        }
        const checkPassword = await (0, handlePassword_1.comparePassword)(password, user.password);
        if (checkPassword) {
            return done(null, user);
        }
        else {
            return done(null, false, {
                message: "비밀번호가 일치하지 않습니다",
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
