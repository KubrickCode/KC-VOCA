import passport from "passport";
import googlePassport from "./google";
import kakaoPassport from "./kakao";
import localPassport from "./local";
import mysql from "mysql2/promise";
import { user } from "../config";

const db = mysql.createPool(user);

export const initializePassport = () => {
  passport.serializeUser((user: any, done: Function) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (email: string, done: Function) => {
    const result = await db.query(
      "SELECT user_id FROM localuser WHERE email=?",
      [email]
    );

    await done(null, result[0]);
  });

  passport.use(localPassport);
  passport.use(googlePassport);
  passport.use(kakaoPassport);

  return passport;
};
