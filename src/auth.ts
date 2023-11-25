import express from "express";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./models/userModel";
import cors from "cors";

export const configureAuthentication = (app: express.Application) => {
  app.use(
    session({
      secret: "instagram-passport-pass",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(express.json());
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "https://instagram-client-abb.vercel.app",
      ],
      optionsSuccessStatus: 200,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      async (username: string, password: string, done: any) => {
        try {
          const user = await User.findOne({ username }).exec();

          if (!user || !bcrypt.compareSync(password, user.password)) {
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

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).exec();
      done(null, user);
    } catch (err: Error | any) {
      console.error(`Error in deserializeUser: ${err.message}`);
      done(err, null);
    }
  });

  return app;
};
