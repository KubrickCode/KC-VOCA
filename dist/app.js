"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const config_1 = require("./lib/config");
const passport_1 = __importDefault(require("passport"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MySQLStoreFactory = require("express-mysql-session");
const MySQLStore = MySQLStoreFactory(express_session_1.default);
const app = (0, express_1.default)();
const link = process.env.REDIRECT_ROOT;
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)({
    origin: link,
    credentials: true,
}));
// view engine setup
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "pug");
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", link);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    next();
});
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    store: new MySQLStore(config_1.sessionstore),
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, connect_flash_1.default)());
const index_1 = __importDefault(require("./routes/index"));
const sign_1 = __importDefault(require("./routes/sign"));
const getdata_1 = __importDefault(require("./routes/getdata"));
const create_1 = __importDefault(require("./routes/create"));
const modify_1 = __importDefault(require("./routes/modify"));
const delete_1 = __importDefault(require("./routes/delete"));
app.use("/", index_1.default);
app.use("/api/signpage", sign_1.default);
app.use("/api/getdata", getdata_1.default);
app.use("/api/create", create_1.default);
app.use("/api/modify", modify_1.default);
app.use("/api/delete", delete_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error.jade");
});
exports.default = app;
