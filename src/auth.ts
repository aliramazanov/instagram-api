import bcrypt from "bcrypt";
import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./models/userModel";

dotenv.config();

const clientID = process.env.CLIENT_ID as string;
const clientSecret = process.env.CLIENT_SECRET as string;

export const configureAuthentication = (app: express.Application) => {
  app.use(
    session({
      secret: "instagram-passport-pass",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(express.json());

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      async (username: string, password: string, done: any) => {
        try {
          const user = await User.findOne({ username }).exec();

          if (
            !user ||
            !user.password ||
            !bcrypt.compareSync(password, user.password)
          ) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  app.use(
    cookieSession({
      name: "google-auth-session",
      keys: ["key1", "key2"],
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL:
          "https://instagram-api-88fv.onrender.com/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, cb) {
        try {
          const existingUser = await User.findOne({ googleId: profile.id });

          if (existingUser) {
            return cb(null, existingUser);
          } else {
            const newUser = new User({
              googleId: profile.id,
            });

            const savedUser = await newUser.save();
            return cb(null, savedUser);
          }
        } catch (err: Error | any) {
          return cb(err || null, undefined);
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

  return app;
};
