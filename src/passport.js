import passport from "passport";
// const KakaoStrategy = require("passport-kakao").Strategy;

import User from "./models/User";
import normalUser from "./models/NormalUser";

// -ver.admin;

passport.use("user", User.createStrategy());

passport.serializeUser((user, done) => {
  console.log("serialize");
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("deserialize");
  done(null, user);
});

// - ver. normal

passport.use("normalUser", normalUser.createStrategy());

passport.serializeUser((user, done) => {
  console.log("serialize");
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("deserialize");
  done(null, user);
});
