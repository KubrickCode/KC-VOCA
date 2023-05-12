"use strict";
//담당 : 이승현
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePassport = void 0;
const passport_1 = __importDefault(require("passport"));
const local_1 = __importDefault(require("./local"));
const google_1 = __importDefault(require("./google"));
const kakao_1 = __importDefault(require("./kakao"));
const User_1 = __importDefault(require("../../models/queries/User"));
const initializePassport = () => {
    passport_1.default.serializeUser((user, done) => {
        done(null, user.email);
    });
    passport_1.default.deserializeUser(async (email, done) => {
        try {
            const result = await User_1.default.getUserByEmail(email);
            done(null, result);
        }
        catch (err) {
            done(err);
        }
    });
    passport_1.default.use(local_1.default);
    passport_1.default.use(google_1.default);
    passport_1.default.use(kakao_1.default);
    return passport_1.default;
};
exports.initializePassport = initializePassport;
