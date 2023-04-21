import { Request, Response, NextFunction } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const asyncHandler = (asyncHandler: AsyncRequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await asyncHandler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default asyncHandler;
