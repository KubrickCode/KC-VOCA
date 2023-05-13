import { hashPassword } from "../integrations/handlePassword";
import {
  loginAuthenticate,
  verifyRefreshToken,
} from "../integrations/handleLogin";
import User from "../models/queries/User";
import { getRandomPassword } from "../integrations/getRandomPassword";
import { mailService } from "../integrations/mailService";

export const loginService = async (email: string, password: string) => {
  return await loginAuthenticate(email, password);
};

export const addUserService = async (
  email: string,
  nickname: string,
  password: string
) => {
  const hashedPassword = await hashPassword(password);
  await User.createUser({
    email,
    nickname,
    password: hashedPassword,
  });
  return await loginAuthenticate(email, password);
};

export const refreshTokenService = async (refreshToken: string) => {
  return await verifyRefreshToken(refreshToken);
};

export const findPasswordService = async (email: string) => {
  const userInfo = await User.getUserByEmail(email);
  if (!userInfo) {
    return false;
  } else {
    const randomPassword = getRandomPassword();
    await User.changePassword(userInfo.id, randomPassword);
    await mailService(email, randomPassword);
    return true;
  }
};
