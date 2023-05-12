import crypto from "crypto";

export const getRandomPassword = () => {
  return crypto.randomBytes(10).toString("base64");
};
