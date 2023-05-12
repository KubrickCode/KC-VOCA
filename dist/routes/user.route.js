"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const validateDto_1 = require("../middlewares/validateDto");
const user_dto_1 = require("../dto/user.dto");
const router = express_1.default.Router();
router.get("/", user_controller_1.getUser);
router.patch("/nickname", (0, validateDto_1.validateDto)(user_dto_1.changeNicknameDto), user_controller_1.changeNickname);
router.patch("/password", (0, validateDto_1.validateDto)(user_dto_1.changePasswordDto), user_controller_1.changePassword);
router.post("/", (0, validateDto_1.validateDto)(user_dto_1.deleteUserDto), user_controller_1.deleteUser);
exports.default = router;
