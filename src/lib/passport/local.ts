import { Strategy } from "passport-local";
import { user as userConfig } from "../config";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const db = mysql.createPool(userConfig);

const verifyCallback = async (
  email: string,
  password: string,
  done: Function
) => {
  try {
    const [userRecords]: any = await db.query(
      `SELECT user_id, email, password FROM localuser WHERE email=?`,
      [email]
    );

    if (!userRecords.length) {
      return done(null, false, { message: "이메일을 확인해 주세요" });
    }

    const user = userRecords[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
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
