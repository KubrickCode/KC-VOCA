import { Strategy } from "passport-local";
import { user } from "../config";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const db = mysql.createPool(user);

const localPassport = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email: string, password: string, done: Function) => {
    const [topics]: any = await db.query(
      `SELECT user_id, email, password FROM localuser WHERE email=?`,
      [email]
    );
    if (!topics.length) {
      return done(null, false, { message: "이메일을 확인해 주세요" });
    }

    const user = topics[0];
    bcrypt.compare(password, user.password, (err: any, result: boolean) => {
      if (err) {
        return done(err);
      }
      if (result) {
        return done(null, user);
      }
      return done(null, false, {
        message: "비밀번호를 확인해 주세요",
      });
    });
  }
);

export default localPassport;
