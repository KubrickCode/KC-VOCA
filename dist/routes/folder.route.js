"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const folder_controller_1 = require("../controllers/folder.controller");
const validateDto_1 = require("../middlewares/validateDto");
const folder_dto_1 = require("../dto/folder.dto");
const router = express_1.default.Router();
router.get("/", folder_controller_1.getFolders);
router.post("/", (0, validateDto_1.validateDto)(folder_dto_1.createFolderDto), folder_controller_1.createFolder);
router.patch("/move", folder_controller_1.moveFolder);
router.patch("/:id", (0, validateDto_1.validateDto)(folder_dto_1.renameFolderDto), folder_controller_1.renameFolder);
router.delete("/:id", folder_controller_1.deleteFolder);
exports.default = router;
