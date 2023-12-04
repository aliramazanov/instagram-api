import bcrypt from "bcrypt";
import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./models/userModel";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

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

          if (!user || !(await bcrypt.compare(password, user.password))) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: "https://instagram-api-88fv.onrender.com/auth/google",
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any
      ) => {
        try {
          console.log(`accessToken: ${accessToken}`);
          console.log(`refreshToken: ${refreshToken}`);

          const username =
            profile.displayName || (profile.emails && profile.emails[0].value);

          let user = await User.findOne({ googleId: profile.id }).exec();

          if (!user) {
            user = new User({
              googleId: profile.id,
              username: username,
            });
            await user.save();
          }

          return done(null, user);
        } catch (error: any) {
          console.error(
            `Error in Google authentication callback: ${error.message}`
          );
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

  return app;
};
