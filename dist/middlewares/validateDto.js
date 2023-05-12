"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
function validateDto(type) {
    return (req, res, next) => {
        (0, class_validator_1.validate)((0, class_transformer_1.plainToClass)(type, req.body)).then((errors) => {
            if (errors.length > 0) {
                const message = errors.reduce((messages, error) => {
                    if (error.constraints) {
                        messages.push(...Object.values(error.constraints));
                    }
                    return messages;
                }, []);
                res.status(400).json({ errors: message });
            }
            else {
                next();
            }
        });
    };
}
exports.validateDto = validateDto;
