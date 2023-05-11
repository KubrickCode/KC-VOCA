import jwt from "jsonwebtoken";
import { Strategy as KakaoStrategy } from "passport-kakao";
import User from "../../models/queries/User";
import { kakaoConfig } from "../../shared/config";
import dotenv from "dotenv";
import { hashPassword } from "../../integrations/handlePassword";
import { getRandomPassword } from "../../integrations/getRandomPassword";
dotenv.config();

const kakaoStrategy = new KakaoStrategy(
  kakaoConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.id + "@kakao.email";
      const displayName = profile.displayName;

      const existingUser = await User.getUserByEmail(email);

      if (existingUser) {
        const token = jwt.sign(existingUser, process.env.JWT_SECRET!, {
          expiresIn: "30d",
        });
        return done(null, { ...existingUser, token });
      }

      const hashedPassword = await hashPassword(getRandomPassword());

      await User.createUser({
        email,
        nickname: displayName,
        password: hashedPassword,
      });

      const savedUser = await User.getUserByEmail(email as string);

      const token = jwt.sign(savedUser, process.env.JWT_SECRET!, {
        expiresIn: "30d",
      });

      done(null, { ...savedUser, token });
    } catch (err) {
      done(err);
    }
  }
);

export default kakaoStrategy;
