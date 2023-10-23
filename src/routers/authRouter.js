import express from "express";
import routes from "../routes";
import {
  authKakao,
  authKakaoCallback,
  authKakaoFail,
  authInstagram,
  authInstagramFail,
  authNaver,
  authNaverCallback,
  authNaverFail,
  authGoogle,
  authGoogleCallback,
  authGoogleFail,
  authFacebook,
  authFacebookCallback,
  authFacebookFail,
  authYoutube,
  authYoutubeCallback,
  authYoutubeFail,
} from "../controllers/authController";

const authRouter = express.Router();

// 카카오톡 로그인 연동
authRouter.get(routes.authKakao, authKakao);
authRouter.get(`${routes.authKakao}/callback`, authKakaoCallback);
authRouter.get(`${routes.authKakao}/fail`, authKakaoFail);

// 인스타그램 로그인 연동
authRouter.get(routes.authInstagram, authInstagram);
authRouter.get(`${routes.authInstagram}/fail`, authInstagramFail);

// 네이버 로그인 연동
authRouter.get(routes.authNaver, authNaver);
authRouter.get(`${routes.authNaver}/callback`, authNaverCallback);
authRouter.get(`${routes.authNaver}/fail`, authNaverFail);

// 구글 로그인 연동
authRouter.get(routes.authGoogle, authGoogle);
authRouter.get(`${routes.authGoogle}/callback`, authGoogleCallback);
authRouter.get(`${routes.authGoogle}/fail`, authGoogleFail);

// 페이스북 로그인 연동
authRouter.get(routes.authFacebook, authFacebook);
authRouter.get(`${routes.authFacebook}/callback`, authFacebookCallback);
authRouter.get(`${routes.authFacebook}/fail`, authFacebookFail);

// 유튜브 로그인 연동
authRouter.get(routes.authYoutube, authYoutube);
authRouter.get(`${routes.authYoutube}/callback`, authYoutubeCallback);
authRouter.get(`${routes.authYoutube}/fail`, authYoutubeFail);

export default authRouter;
