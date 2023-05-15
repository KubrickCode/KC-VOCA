"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT 시크릿 키가 없습니다");
    }
    if (!authHeader) {
        return res.status(401).json({ message: "인증 토큰이 없습니다" });
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
        return res.status(401).send({ message: "토큰이 Bearer방식이 아닙니다" });
    }
    const scheme = parts[0];
    const token = parts[1];
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ message: "토큰 유형이 잘못되었습니다" });
    }
    jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send({ message: "토큰이 만료되었습니다" });
            }
            else {
                return res.status(401).send({ message: "잘못된 토큰 형식입니다" });
            }
        }
        req.user = decoded;
        return next();
    });
};
exports.default = validateToken;
