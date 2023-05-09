import { Strategy as KakaoStrategy } from "passport-kakao";
import User from "../../models/queries/User";
import { kakaoConfig } from "../../shared/config";
import dotenv from "dotenv";
import { hashPassword } from "../../integrations/handlePassword";
dotenv.config();

const kakaoStrategy = new KakaoStrategy(
  kakaoConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.id + "@kakao.email";
      const displayName = profile.displayName;

      const existingUser = await User.getUserByEmail(email);

      if (existingUser) {
        return done(null, existingUser);
      }

      const hashedPassword = await hashPassword(profile.id);

      const savedUser = await User.createUser({
        email,
        nickname: displayName,
        password: hashedPassword,
      });

      done(null, savedUser);
    } catch (err) {
      done(err);
    }
  }
);

export default kakaoStrategy;
