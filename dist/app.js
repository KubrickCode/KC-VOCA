"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = require("./middlewares/passport");
require("express-async-errors");
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const link = process.env.REDIRECT_ROOT;
app.use((0, cors_1.default)({
    origin: link,
    credentials: true,
}));
app.use((0, helmet_1.default)());
const passport = (0, passport_1.initializePassport)();
app.use(passport.initialize());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/", (req, res) => res.send("Hello, Express"));
app.use("/api", routes_1.default);
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
app.use(((err, req, res, next) => {
    console.error(err.message);
    res
        .status(err.status || 500)
        .json({ message: err.message || "서버 실행 오류" });
}));
app.listen(3000, () => {
    console.log("3000번 포트에서 서버 실행");
});
