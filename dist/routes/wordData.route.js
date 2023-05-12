"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wordData_controller_1 = require("../controllers/wordData.controller");
const validateDto_1 = require("../middlewares/validateDto");
const wordData_dto_1 = require("../dto/wordData.dto");
const router = express_1.default.Router();
router.get("/:id", wordData_controller_1.getWordData);
router.post("/", (0, validateDto_1.validateDto)(wordData_dto_1.createWordDataDto), wordData_controller_1.createWordData);
router.post("/tts", (0, validateDto_1.validateDto)(wordData_dto_1.ttsServiceDto), wordData_controller_1.ttsService);
router.post("/search", (0, validateDto_1.validateDto)(wordData_dto_1.searchDto), wordData_controller_1.search);
router.patch("/complete", (0, validateDto_1.validateDto)(wordData_dto_1.updateCompleteDto), wordData_controller_1.updateComplete);
router.patch("/:id", (0, validateDto_1.validateDto)(wordData_dto_1.updateWordDataDto), wordData_controller_1.updateWordData);
router.delete("/:id", wordData_controller_1.deleteWordData);
exports.default = router;
