import { Request, Response, NextFunction } from "express";

const isLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      next();
    } else {
      throw new Error("로그인 여부를 확인하세요");
    }
  } catch (err) {
    next(err);
  }
};

export default isLogin;
