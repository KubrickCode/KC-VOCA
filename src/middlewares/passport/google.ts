//담당 : 이승현

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../../models/queries/User";
import { googleConfig } from "../../shared/config";
import dotenv from "dotenv";
import { hashPassword } from "../../integrations/handlePassword";
dotenv.config();

const googleStrategy = new GoogleStrategy(
  googleConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const name = profile.username as string;
      const email = profile._json.email as string;
      const existingUser = await User.getUserByEmail(
        profile._json.email as string
      );

      if (existingUser) {
        return done(null, existingUser);
      }

      const hashedPassword = await hashPassword(String(name));

      await User.createUser({
        email,
        nickname: name,
        password: hashedPassword,
      });

      const savedUser = await User.getUserByEmail(
        profile._json.email as string
      );

      done(null, savedUser);
    } catch (err: any) {
      done(err);
    }
  }
);

export default googleStrategy;
