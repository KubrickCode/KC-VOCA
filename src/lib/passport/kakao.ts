import { Strategy } from "passport-kakao";
import { kakao, user } from "../config";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import shortid from "shortid";

if (!kakao.kakao_id || !kakao.kakao_callback) {
  throw new Error("카카오 로그인 구성요소에 필수 속성이 없습니다.");
}

const db = mysql.createPool(user);

const verifyCallback = async (
  accessToken: any,
  refreshToken: any,
  profile: { id: string; displayName: string },
  done: Function
) => {
  try {
    const newProfile = { email: profile.id + "@kakao.email" };
    const checked = await db.query("SELECT * FROM localuser WHERE email=?", [
      newProfile.email,
    ]);

    if (checked[0]) {
      return done(null, newProfile);
    } else {
      const hashedPassword = await bcrypt.hash(shortid.generate(), 10);
      const topics = (await db.query(
        `INSERT INTO localuser(email, password, nickname) VALUES(?,?,?);
      SELECT user_id FROM localuser WHERE email=?
      `,
        [
          newProfile.email,
          hashedPassword,
          profile.displayName,
          newProfile.email,
        ]
      )) as unknown as [mysql.OkPacket, { user_id: number }[]];

      const { user_id } = topics[1][0];
      await db.query(
        "INSERT INTO voca_folder(user_id,folder_name,parent_id) VALUES(?,'Home',0)",
        [user_id]
      );

      return done(null, newProfile);
    }
  } catch (err) {
    done(err);
  }
};

const kakaoPassport = new Strategy(
  {
    clientID: kakao.kakao_id,
    callbackURL: kakao.kakao_callback,
  },
  verifyCallback
);

export default kakaoPassport;
