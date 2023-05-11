import createError from "http-errors";
import express, { ErrorRequestHandler } from "express";
import logger from "morgan";
import dotenv from "dotenv";
import Routes from "./routes";
dotenv.config();

const app = express();

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

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send("Hello, Express"));

app.use("/api", Routes);

app.use((req, res, next) => {
  next(createError(404));
});

app.use(((err, req, res, next) => {
  res.status(err.status || 500);
  console.error(err.message);
}) as ErrorRequestHandler);

app.listen(3000);
