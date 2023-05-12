import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import { RequestHandler } from "express";

export function validateDto<T extends object>(
  type: new () => T
): RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body)).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.reduce((messages, error: ValidationError) => {
          if (error.constraints) {
            messages.push(...Object.values(error.constraints));
          }
          return messages;
        }, [] as string[]);
        res.status(400).json({ errors: message });
      } else {
        next();
      }
    });
  };
}
