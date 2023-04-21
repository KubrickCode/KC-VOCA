"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isLogin = (req, res, next) => {
    try {
        if (req.user) {
            next();
        }
        else {
            throw new Error("로그인 여부를 확인하세요");
        }
    }
    catch (err) {
        next(err);
    }
};
exports.default = isLogin;
