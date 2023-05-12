import createError from "http-errors";
import express, { ErrorRequestHandler } from "express";
import logger from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { initializePassport } from "./middlewares/passport";
import "express-async-errors";
import Routes from "./routes";
dotenv.config();

const app = express();

const link = process.env.REDIRECT_ROOT;

app.use(
  cors({
    origin: link,
    credentials: true,
  })
);
app.use(helmet());

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
  console.error(err.message);
  res
    .status(err.status || 500)
    .json({ message: err.message || "서버 실행 오류" });
}) as ErrorRequestHandler);

app.listen(3000, () => {
  console.log("3000번 포트에서 서버 실행");
});
