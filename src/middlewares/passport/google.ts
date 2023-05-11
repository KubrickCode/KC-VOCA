// googleStrategy.ts
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../../models/queries/User";
import { googleConfig } from "../../shared/config";
import { hashPassword } from "../../integrations/handlePassword";
import { getRandomPassword } from "..//../integrations/getRandomPassword";

const googleStrategy = new GoogleStrategy(
  googleConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const name = profile.displayName as string;
      const email = profile._json.email as string;
      const existingUser = await User.getUserByEmail(
        profile._json.email as string
      );

      if (existingUser) {
        const token = jwt.sign(existingUser, process.env.JWT_SECRET!, {
          expiresIn: "30d",
        });
        return done(null, { ...existingUser, token });
      }

      const hashedPassword = await hashPassword(getRandomPassword());

      await User.createUser({
        email,
        nickname: name,
        password: hashedPassword,
      });

      const savedUser = await User.getUserByEmail(
        profile._json.email as string
      );

      const token = jwt.sign(savedUser, process.env.JWT_SECRET!, {
        expiresIn: "30d",
      });

      done(null, { ...savedUser, token });
    } catch (err: any) {
      done(err);
    }
  }
);

export default googleStrategy;
