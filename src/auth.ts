import express from "express";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./models/userModel";

const app = express();
app.use(express.json());

export const configureAuthentication = () => {
  app.use(
    session({
      secret: "instagram-passport-pass",
      resave: false,
      saveUninitialized: false,
    } as any)
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      async (username: string, password: string, done: any) => {
        try {
          const user = await User.findOne({ username }).exec();

          if (!user) {
            return done(null, false);
          }

          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(
      id,
      (err: any, user: boolean | Express.User | null | undefined) => {
        done(err, user);
      }
    );
  });

  return app;
};
