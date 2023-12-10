import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./models/userModel";

dotenv.config();

export const configureAuthentication = (auth: express.Application) => {
  auth.use(
    session({
      secret: "instagram-passport-pass",
      resave: false,
      saveUninitialized: false,
    })
  );

  auth.use(express.json());

  auth.use(passport.initialize());
  auth.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      async (username: string, password: string, done: any) => {
        try {
          if (username && password) {
            const user = await User.findOne({ username }).exec();

            if (
              !user ||
              !user.password ||
              !bcrypt.compareSync(password, user.password)
            ) {
              return done(null, false);
            }

            return done(null, user);
          } else {
            return done(null, false);
          }
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
    } catch (err: any) {
      console.error(`Error in deserializeUser: ${err.message}`);
      done(err, null);
    }
  });

  return auth;
};
