"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./user.route"));
const folder_route_1 = __importDefault(require("./folder.route"));
const words_route_1 = __importDefault(require("./words.route"));
const wordData_route_1 = __importDefault(require("./wordData.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const validateToken_1 = __importDefault(require("../middlewares/validateToken"));
const router = express_1.default.Router();
router.use("/user", validateToken_1.default, user_route_1.default);
router.use("/folders", validateToken_1.default, folder_route_1.default);
router.use("/words", validateToken_1.default, words_route_1.default);
router.use("/word-data", validateToken_1.default, wordData_route_1.default);
router.use("/auth", auth_route_1.default);
exports.default = router;
