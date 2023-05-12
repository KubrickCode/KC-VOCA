import AWS from "aws-sdk";
import { awsConfig } from "../shared/config";

const Polly = new AWS.Polly({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  signatureVersion: awsConfig.signatureVersion,
  region: awsConfig.region,
});

export const playSound = async (Text: string) => {
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
