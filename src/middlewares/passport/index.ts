//담당 : 이승현

import passport from "passport";
import localPassport from "./local";
import googleStrategy from "./google";
import kakaoStrategy from "./kakao";
import User from "../../models/queries/User";

export const initializePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (email: string, done: any) => {
    try {
      const result = await User.getUserByEmail(email);
      done(null, result);
    } catch (err) {
      done(err);
    }
  });

  passport.use(localPassport);
  passport.use(googleStrategy);
  passport.use(kakaoStrategy);

  return passport;
};
