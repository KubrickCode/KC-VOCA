import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../../models/queries/User";
import { googleConfig } from "../../shared/config";
import { hashPassword } from "../../integrations/handlePassword";
import { getRandomPassword } from "../../integrations/getRandomPassword";
import { signJWT } from "../../integrations/handleLogin";
import { storeRefreshToken } from "../../models/Redis";

const googleStrategy = new GoogleStrategy(
  googleConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const name = profile.displayName as string;
      const email = profile._json.email as string;
      const existingUser = await User.getUserByEmail(email);

      if (existingUser) {
        const { id } = existingUser;
        const { token, refreshToken } = signJWT({ id, email, nickname: name });
        await storeRefreshToken(id, refreshToken);
        return done(null, { ...existingUser, token, refreshToken });
      }

      const hashedPassword = await hashPassword(getRandomPassword());

      await User.createUser({
        email,
        nickname: name,
        password: hashedPassword,
      });

      const savedUser = await User.getUserByEmail(email);

      const { id } = savedUser;

      const { token, refreshToken } = signJWT({ id, email, nickname: name });
      await storeRefreshToken(id, refreshToken);

      done(null, { ...savedUser, token, refreshToken });
    } catch (err: any) {
      done(err);
    }
  }
);

export default googleStrategy;
