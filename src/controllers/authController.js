import passport from "passport";
import dotenv from "dotenv";
import moment from "moment";
import routes from "../routes";
import User from "../models/User";

const KakaoStrategy = require("passport-kakao").Strategy;
const InstagramStrategy = require("passport-instagram").Strategy;
const NaverStrategy = require("passport-naver").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const YoutubeV3Strategy = require("passport-youtube-v3").Strategy;

dotenv.config();

passport.serializeUser((user, done) => {
  console.log("serialize");
  done(null, user);
});
passport.deserializeUser((user, done) => {
  console.log("deserialize");
  done(null, user);
});

// 카카오톡 로그인
passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_APIKEY,
      clientSecret: "", // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
      callbackURL: `${process.env.SITE_DOMAIN}${routes.auth}${routes.authKakao}/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        // FIXME: profile 안에 필요한 정보 주석제거 후 사용. 미사용 정보는 제거 필수
        const username = profile.username; // 이름
        const email = profile._json.kakao_account.email; // 이메일(필수정보로 변경은 kakao developer에서 사업자등록정보 적용 필수)
        // const year = profile._json.kakao_account.birthyear; // 생년
        // const birthAgreeBool = profile._json.kakao_account.gender_needs_agreement; // 생일 수집 동의 여부
        // const birth = profile._json.kakao_account.birth; // 생일
        // const gender = profile._json.kakao_account.gender; // 성별
        // const age_range = profile._json.kakao_account.age_range; // 연령대
        // const profileImgAgreeBool = profile._json.kakao_account.profile_image_needs_agreement; // 프로필 이미지 수집 동의 여부
        // const profileImage = profile._json.properties.profile_image; // 프로필 이미지
        // const phoneNumber = `0${profile._json.kakao_account.phone_number.split(" ")[1]}`; // 전화번호(필수정보로 변경은 ......)

        // 기존에 동일한 아이디의 유저가 존재하는지 체크
        const existID = await User.findOne({ userID: profile._json.kakao_account.email });
        const password = "kakaoLogin";
        let users;
        if (existID) {
          users = existID;
        } else {
          users = await User({
            userID: email,
            // profileImg: !profileImgAgreeBool ? profileImage : "",
            name: username,
            role: "normal",
            // gender: profile._json.kakao_account.has_gender && !profile._json.kakao_account.gender_needs_agreement ? profile._json.kakao_account.gender : "",
            // birthYear: profile._json.kakao_account.birthyear,
            // birthMonth: profile._json.kakao_account.has_birthday && !profile._json.kakao_account.birthday_needs_agreement ? profile._json.kakao_account.birthday.slice(0, 2) : "",
            // birthDate: profile._json.kakao_account.has_birthday && !profile._json.kakao_account.birthday_needs_agreement ? profile._json.kakao_account.birthday.slice(2) : "",
          });
          await User.register(users, password);
        }
        return done(null, users);
      } catch (e) {
        console.log(e);
      }
    }
  )
);
export const authKakao = passport.authenticate("kakao");
export const authKakaoCallback = passport.authenticate("kakao", {
  successRedirect: routes.home,
  failureRedirect: `${routes.auth}${routes.authKakao}/fail`,
});
export const authKakaoFail = (req, res) => {
  try {
    res.send(
      `<script>alert("카카오톡 로그인에 실패하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("알 수 없는 오류가 발생하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  }
};

// 인스타그램 로그인
passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTA_CLIENT_ID,
      clientSecret: process.env.INSTA_CLIENT_PW,
      // FIXME: 사이트 배포 시 활성화
      // callbackURL: `${process.env.SITE_DOMAIN}${routes.auth}${routes.authInstagram}/callback`,
      // FIXME: 사이트 배포 전에는 ngrok 주소를 만들어서 확인 후 배포 전 삭제.
      callbackURL: `https://f70f-210-205-234-96.ngrok.io${routes.auth}${routes.authInstagram}/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        process.nextTick(async () => {
          // FIXME: 사용자 정보 체크 후 제거
          // FIXME: 사용자 정보 체크 시 추가적인 정보 확인하면 하단 정보 변수영역에 내용 추가 필수
          // console.log(profile);
          // FIXME: profile 안에 필요한 정보 주석제거 후 사용 미사용 정보는 제거 필수
          const userID = profile._json.id; // 계정 고유 id
          const username = profile._json.username; // 계정명
          // 기존에 동일한 아이디의 유저가 존재하는지 체크
          const existID = await User.findOne({ userID });
          const password = "instagram";
          let users;
          if (existID) {
            users = existID;
          } else {
            users = await User({
              userID,
              name: username,
              role: "admin", // FIXME: 역할 수정 후 주석제거
            });
            await User.register(users, password);
          }
          return done(null, users);
        });
      } catch (e) {
        console.log(e);
      }
    }
  )
);
export const authInstagram = passport.authenticate("instagram", {
  scope: ["user_profile"],
});
export const authInstagramFail = (req, res) => {
  try {
    res.send(
      `<script>alert("인스타그램 로그인에 실패하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("알 수 없는 오류가 발생하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  }
};

// 네이버 로그인
passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: `${process.env.SITE_DOMAIN}${routes.auth}${routes.authNaver}/callback`,
      // FIXME: 로그인 시 계속적으로 인증방식을 활성화하려면 사용 / 미사용 시 제거
      // svcType: 0,
      // authType: "reauthenticate", // enable re-authentication
    },
    async (accessToken, refreshToken, profile, done) => {
      // 사용자의 정보는 profile에 들어있다.
      try {
        // FIXME: 사용자 정보 체크 후 제거
        // FIXME: 사용자 정보 체크 시 추가적인 정보 확인하면 하단 정보 변수영역에 내용 추가 필수
        console.log(profile);
        // FIXME: profile 안에 필요한 정보 주석제거 후 사용 미사용 정보는 제거 필수
        const userID = profile._json.email; // 네이버 회원의 이메일(프로젝트 아이디 형식이 이메일인경우 사용)
        // const profileImg = profile._json.profile_image; // 네이버에서 설정한 프로필 이미지
        // const age = profile._json.age; // 네이버에 설정된 연령대 ex 30~39
        // const birthday = profile._json.birthday; // 생일 ex 01-02

        // 기존에 동일한 아이디의 유저가 존재하는지 체크
        const existID = await User.findOne({ userID });
        const password = "naverLogin";
        let users;
        if (existID) {
          users = existID;
        } else {
          users = await User({
            userID,
            role: "general",
            // createdAt: moment(new Date()).tz("Asia/Seoul"),
          });
          await User.register(users, password);
        }
        return done(null, users);
      } catch (e) {
        console.log(e);
      }
    }
  )
);
export const authNaver = passport.authenticate("naver");
export const authNaverCallback = passport.authenticate("naver", {
  successRedirect: routes.home,
  failureRedirect: `${routes.auth}${routes.authNaver}/fail`,
});
export const authNaverFail = (req, res) => {
  try {
    res.send(
      `<script>alert("네이버 로그인에 실패하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("알 수 없는 오류가 발생하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  }
};

// 구글 로그인
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SITE_DOMAIN}${routes.auth}${routes.authGoogle}/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      // 사용자의 정보는 profile에 들어있다.
      try {
        // FIXME: 사용자 정보 체크 후 제거
        // FIXME: 사용자 정보 체크 시 추가적인 정보 확인하면 하단 정보 변수영역에 내용 추가 필수
        console.log(profile);
        // FIXME: profile 안에 필요한 정보 주석제거 후 사용 미사용 정보는 제거 필수
        // const sub = profile._json.sub; // 고유 값
        const name = profile._json.name; // 성명
        // const given_name = profile._json.given_name; // 이름
        // const family_name = profile._json.family_name; // 성(이름)
        // const picture = profile._json.picture; // 구글 프로파일 이미지
        const email = profile._json.email; // 구글 이메일(아이디)
        // const email_verified = profile._json.email_verified; // 이메일 인증 동의
        // const locale = profile._json.locale; // 국가
        const userID = profile._json.email;
        // 기존에 동일한 아이디의 유저가 존재하는지 체크
        const existID = await User.findOne({ userID });
        const password = "googleLogin";
        let users;
        if (existID) {
          users = existID;
        } else {
          users = await User({
            userID,
            name,
            role: "general",
            createdAt: moment(new Date()).tz("Asia/Seoul"),
          });
          await User.register(users, password);
        }
        return done(null, users);
      } catch (e) {
        console.log(e);
      }
    }
  )
);
export const authGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});
export const authGoogleCallback = passport.authenticate("google", {
  successRedirect: routes.home,
  failureRedirect: `${routes.auth}${routes.authGoogle}/fail`,
});
export const authGoogleFail = (req, res) => {
  try {
    res.send(
      `<script>alert("구글 로그인에 실패하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("알 수 없는 오류가 발생하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  }
};

// 페이스북 로그인
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      // FIXME: 사이트 배포 시 활성화
      // callbackURL: `${process.env.SITE_DOMAIN}${routes.auth}${routes.authFacebook}/callback`,
      // FIXME: 사이트 배포 전에는 ngrok 주소로 만들어서 확인 후 배포 전 삭제.
      callbackURL: `https://f70f-210-205-234-96.ngrok.io${routes.auth}${routes.authFacebook}/callback`,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      // 사용자의 정보는 profile에 들어있다.
      // FIXME: 앱검수 필수 => 필요내용 추가 필수
      try {
        // FIXME: 사용자 정보 체크 후 제거
        console.log(profile);
        // FIXME: profile 안에 필요한 정보 주석제거 후 사용 미사용 정보는 제거 필수
        // FIXME: 앱 검수 필수
        const userID = profile._json.email;
        // const pforileImg = profile._json.photos[0].value; // 프로필 이미지
        // const name = profile._json.name; // 이름

        // 기존에 동일한 아이디의 유저가 존재하는지 체크
        const existID = await User.findOne({ userID });
        const password = "facebookLogin";
        let users;
        if (existID) {
          users = existID;
        } else {
          users = await User({
            userID,
            role: "general",
            createdAt: moment(new Date()).tz("Asia/Seoul"),
          });
          await User.register(users, password);
        }
        return done(null, users);
      } catch (e) {
        console.log(e);
      }
    }
  )
);
export const authFacebook = passport.authenticate("facebook");
export const authFacebookCallback = passport.authenticate("facebook", {
  successRedirect: routes.home,
  failureRedirect: `${routes.auth}${routes.authFacebook}/fail`,
});
export const authFacebookFail = (req, res) => {
  try {
    res.send(
      `<script>alert("페이스북 로그인에 실패하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("알 수 없는 오류가 발생하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  }
};

// 유튜브 로그인
passport.use(
  new YoutubeV3Strategy(
    {
      clientID: process.env.YOUTUBE_CLIENT_ID,
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
      callbackURL: `${process.env.SITE_DOMAIN}${routes.auth}${routes.authYoutube}/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // FIXME: 사용자 정보 체크 후 제거
        console.log(profile);
        // FIXME: profile 안에 필요한 정보 주석제거 후 사용 미사용 정보는 제거 필수
        // 기존에 동일한 아이디의 유저가 존재하는지 체크
        const existID = await User.findOne({ userID: profile.id });
        const password = "youtubeLogin";

        let users;
        if (existID) {
          users = existID;
        } else {
          users = await User({
            userID: profile._json.items[0].id,
            userName: profile._json.items[0].snippet.title,
            thumbnail: profile._json.items[0].snippet.thumbnails.medium.url,
            role: "normal",
          });
          await User.register(users, password);
        }

        return done(null, users);
      } catch (e) {
        console.log(e);
      }
    }
  )
);
export const authYoutube = passport.authenticate("youtube");
export const authYoutubeCallback = passport.authenticate("youtube", {
  successRedirect: routes.home,
  failureRedirect: `${routes.auth}${routes.authYoutube}/fail`,
});
export const authYoutubeFail = (req, res) => {
  try {
    res.send(
      `<script>alert("유튜브 로그인에 실패하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("알 수 없는 오류가 발생하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  }
};
