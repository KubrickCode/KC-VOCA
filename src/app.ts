import createError from "http-errors";
import express, { ErrorRequestHandler } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import { sessionstore } from "./lib/config";
import flash from "connect-flash";
import dotenv from "dotenv";
import isLogin from "./middlewares/isLogin";
import Routes from "./routes";
dotenv.config();

const app = express();
const MySQLStoreFactory = require("express-mysql-session");
const MySQLStore = MySQLStoreFactory(session);

const link = process.env.REDIRECT_ROOT;

import cors from "cors";
import { initializePassport } from "./middlewares/passport";
app.use(
  cors({
    origin: link,
    credentials: true,
  })
);

const passport = initializePassport();
app.use(passport.initialize());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send("Hello, Express"));

app.use("/api", Routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(((err, req, res, next) => {
  res.status(err.status || 500);
  console.error(err.message);
}) as ErrorRequestHandler);

app.listen(3000);
