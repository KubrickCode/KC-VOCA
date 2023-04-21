"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (asyncHandler) => {
    return async (req, res, next) => {
        try {
            return await asyncHandler(req, res, next);
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = asyncHandler;
