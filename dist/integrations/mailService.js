"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailService = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = require("../shared/config");
const SES_CONFIG = {
    accessKeyId: config_1.awsConfig.accessKeyId,
    secretAccessKey: config_1.awsConfig.secretAccessKey,
    region: config_1.awsConfig.k_region,
};
const AWS_SES = new aws_sdk_1.default.SES(SES_CONFIG);
const mailService = async (email, password) => {
    let params = {
        Source: "kcvoca2023@gmail.com",
        Destination: {
            ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
        새로 발급된 임시비밀번호 : ' ${password} '
        로그인 후 비밀번호를 꼭 변경해주세요.
        `,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: `kcvoca에서의 새 비밀번호를 확인해 주세요`,
            },
        },
    };
    AWS_SES.sendEmail(params).promise();
};
exports.mailService = mailService;
