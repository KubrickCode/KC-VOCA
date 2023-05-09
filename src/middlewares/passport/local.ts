//담당 : 이승현

import { Strategy } from "passport-local";
import User from "../../models/queries/User";
import { comparePassword } from "./../../integrations/handlePassword";

const verifyCallback = async (email: string, password: string, done: any) => {
  try {
    const user = await User.getUserByEmail(email);
    if (!user) {
      return done(null, false, { message: "존재하지 않는 계정입니다" });
    }

    const checkPassword = await comparePassword(password, user.password);
    if (checkPassword) {
      return done(null, user);
    } else {
      return done(null, false, {
        message: "비밀번호를 확인해 주세요",
      });
    }
  } catch (err) {
    done(err);
  }
};

const localPassport = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  verifyCallback
);

export default localPassport;
