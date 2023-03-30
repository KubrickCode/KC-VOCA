import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import { sessionstore } from "./lib/config";
import passport from "passport";
import flash from "connect-flash";
import dotenv from "dotenv";
dotenv.config();
const MySQLStoreFactory = require("express-mysql-session");
const MySQLStore = MySQLStoreFactory(session);
const app = express();

const link = process.env.REDIRECT_ROOT;

import cors from "cors";
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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", link as string);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    store: new MySQLStore(sessionstore),
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
app.use(flash());

import indexRouter from "./routes/index";
import signRouter from "./routes/sign";
import getDataRouter from "./routes/getdata";
import createRouter from "./routes/create";
import modifyRouter from "./routes/modify";
import deleteRouter from "./routes/delete";

app.use("/", indexRouter);
app.use("/api/signpage", signRouter);
app.use("/api/getdata", getDataRouter);
app.use("/api/create", createRouter);
app.use("/api/modify", modifyRouter);
app.use("/api/delete", deleteRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error.jade");
});

export default app;
