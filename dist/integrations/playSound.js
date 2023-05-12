"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playSound = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = require("../shared/config");
const Polly = new aws_sdk_1.default.Polly({
    accessKeyId: config_1.awsConfig.accessKeyId,
    secretAccessKey: config_1.awsConfig.secretAccessKey,
    signatureVersion: config_1.awsConfig.signatureVersion,
    region: config_1.awsConfig.region,
});
const playSound = async (Text) => {
    const params = {
        Text,
        OutputFormat: "mp3",
        VoiceId: "Matthew",
    };
    const data = await Polly.synthesizeSpeech(params).promise();
    if (data?.AudioStream instanceof Buffer) {
        return data.AudioStream;
    }
};
exports.playSound = playSound;
