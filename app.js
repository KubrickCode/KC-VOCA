const createError = require("http-errors");
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const session = require("express-session");
const sessionStore = require("./lib/config").sessionstore;
const MySQLStore = require("express-mysql-session")(session);
const passport = require("passport");

const flash = require("connect-flash");
app.use(flash());

require("dotenv").config();

const link = process.env.CORS_LINK;

const cors = require("cors");
app.use(
  cors({
    origin: link,
    credentials: true,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", link);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new MySQLStore(sessionStore),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const indexRouter = require("./routes/index");
const signRouter = require("./routes/sign");
const getDataRouter = require("./routes/getdata");
const createRouter = require("./routes/create");
const modifyRouter = require("./routes/modify");
const deleteRouter = require("./routes/delete");

app.get("/api/policy", (req, res) => {
  res.sendFile(__dirname + "/privacy_policy.html");
});

app.use("/api/", indexRouter);
app.use("/api/signpage", signRouter);
app.use("/api/getdata", getDataRouter);
app.use("/api/create", createRouter);
app.use("/api/modify", modifyRouter);
app.use("/api/delete", deleteRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error.jade");
});

module.exports = app;
