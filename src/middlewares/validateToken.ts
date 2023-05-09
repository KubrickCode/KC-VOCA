import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { UserType } from "src/models/types";
dotenv.config();

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT 시크릿 키가 없습니다");
  }

  if (!authHeader) {
    return res.status(401).json({ message: "인증 토큰이 없습니다" });
  }

  jwt.verify(authHeader, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "잘못된 토큰 형식입니다" });
    }
    req.user = decoded as UserType;
    return next();
  });
};

export default validateToken;
