"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const getRandomPassword = () => {
    return crypto_1.default.randomBytes(10).toString("base64");
};
exports.getRandomPassword = getRandomPassword;
