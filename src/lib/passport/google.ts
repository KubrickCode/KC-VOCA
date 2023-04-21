import { Strategy } from "passport-google-oauth2";
import { google, user } from "../config";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import shortid from "shortid";

if (!google.google_id || !google.google_secret || !google.google_callback) {
  throw new Error("Google 로그인 구성요소에 필수 속성이 없습니다.");
}

const db = mysql.createPool(user);

const googlePassport = new Strategy(
  {
    clientID: google.google_id,
    clientSecret: google.google_secret,
    callbackURL: google.google_callback,
    passReqToCallback: true,
  },
  async (
    request: any,
    accessToken: any,
    refreshToken: any,
    profile: { email: string; displayName: string },
    done: Function
  ) => {
    const result = await db.query("SELECT * FROM localuser WHERE email=?", [
      profile.email,
    ]);
    if (result[0]) {
      return done(null, profile);
    } else {
      const hashedPassword = await bcrypt.hash(shortid.generate(), 10);
      const topics = (await db.query(
        `INSERT INTO localuser(email, password, nickname) VALUES(?,?,?);
      SELECT user_id FROM localuser WHERE email=?
      `,
        [profile.email, hashedPassword, profile.displayName, profile.email]
      )) as unknown as [mysql.OkPacket, { user_id: number }[]];

      const uid = topics[1][0].user_id;
      await db.query(
        "INSERT INTO voca_folder(user_id,folder_name,parent_id) VALUES(?,'Home',0)",
        [uid]
      );
      return done(null, profile);
    }
  }
);

export default googlePassport;
