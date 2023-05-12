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
    jsonwebtoken_1.default.verify(authHeader, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "잘못된 토큰 형식입니다" });
        }
        req.user = decoded;
        return next();
    });
};
exports.default = validateToken;
