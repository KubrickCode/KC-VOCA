"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const validateDto_1 = require("../middlewares/validateDto");
const auth_dto_1 = require("../dto/auth.dto");
const router = express_1.default.Router();
router.post("/login", (0, validateDto_1.validateDto)(auth_dto_1.loginDto), auth_controller_1.login);
router.post("/refresh", auth_controller_1.refreshToken);
router.post("/signup", (0, validateDto_1.validateDto)(auth_dto_1.addUserDto), auth_controller_1.addUser);
router.post("/find-password", (0, validateDto_1.validateDto)(auth_dto_1.findPasswordDto), auth_controller_1.findPassword);
router.get("/google", auth_controller_1.googleLogin);
router.get("/google/callback", auth_controller_1.googleCallback);
router.get("/kakao", auth_controller_1.kakaoLogin);
router.get("/kakao/callback", auth_controller_1.kakaoCallback);
exports.default = router;
