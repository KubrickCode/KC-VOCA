"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const words_controller_1 = require("../controllers/words.controller");
const validateDto_1 = require("../middlewares/validateDto");
const words_dto_1 = require("../dto/words.dto");
const router = express_1.default.Router();
router.get("/:id", words_controller_1.getWords);
router.post("/", (0, validateDto_1.validateDto)(words_dto_1.createWordsDto), words_controller_1.createWords);
router.patch("/move", words_controller_1.moveWords);
router.patch("/status/:id", (0, validateDto_1.validateDto)(words_dto_1.changeStatusDto), words_controller_1.changeStatus);
router.patch("/recent/:id", words_controller_1.updateRecentView);
router.patch("/:id", (0, validateDto_1.validateDto)(words_dto_1.renameWordsDto), words_controller_1.renameWords);
router.delete("/:id", words_controller_1.deleteWords);
exports.default = router;
