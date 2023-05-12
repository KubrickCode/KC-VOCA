import { Strategy as KakaoStrategy } from "passport-kakao";
import User from "../../models/queries/User";
import { kakaoConfig } from "../../shared/config";
import dotenv from "dotenv";
import { hashPassword } from "../../integrations/handlePassword";
import { getRandomPassword } from "../../integrations/getRandomPassword";
import { signJWT } from "../../integrations/handleLogin";
dotenv.config();

const kakaoStrategy = new KakaoStrategy(
  kakaoConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.id + "@kakao.email";
      const displayName = profile.displayName;

      const existingUser = await User.getUserByEmail(email);

      if (existingUser) {
        const { id } = existingUser;
        const token = signJWT({ id, email, nickname: displayName });
        return done(null, { ...existingUser, token });
      }

      const hashedPassword = await hashPassword(getRandomPassword());

      await User.createUser({
        email,
        nickname: displayName,
        password: hashedPassword,
      });

      const savedUser = await User.getUserByEmail(email as string);
      const { id } = savedUser;

      const token = signJWT({ id, email, nickname: displayName });

      done(null, { ...savedUser, token });
    } catch (err) {
      done(err);
    }
  }
);

export default kakaoStrategy;
