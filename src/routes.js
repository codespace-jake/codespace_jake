// Global
const HOME = "/";

// User
const USER = "/user";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const FIND_ID = "/find-id";
const FORGOT_PW = "/forgot-pw";
const CHANGE_PW = "/change-pw";

// Auth
const AUTH = "/auth";
const AUTH_KAKAO = "/kakao";
const AUTH_INSTAGRAM = "/instagram";
const AUTH_NAVER = "/naver";
const AUTH_GOOGLE = "/google";
const AUTH_FACEBOOK = "/facebook";
const AUTH_YOUTUBE = "/youtube";

// Admin
const ADMIN = "/admin";
const ADMIN_REGISTER = "/register";
const ADMIN_LOGIN = "/login";
const ADMIN_LOGOUT = "/logout";
const ADMIN_CHANGE_PW = "/change-pw";
const ADMIN_USER = "/user";
// ADMIN SAMPLE(CRUD용)
const ADMIN_SAMPLE = "/sample";

// API
const API = "/api";

const routes = {
  // Global
  home: HOME,

  // User
  user: USER,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  findID: FIND_ID,
  forgotPW: FORGOT_PW,
  changePW: CHANGE_PW,

  // auth
  auth: AUTH,
  authKakao: AUTH_KAKAO,
  authInstagram: AUTH_INSTAGRAM,
  authNaver: AUTH_NAVER,
  authGoogle: AUTH_GOOGLE,
  authFacebook: AUTH_FACEBOOK,
  authYoutube: AUTH_YOUTUBE,

  // Admin
  admin: ADMIN,
  adminRegister: ADMIN_REGISTER,
  adminLogin: ADMIN_LOGIN,
  adminLogout: ADMIN_LOGOUT,
  adminChangePW: ADMIN_CHANGE_PW,
  adminUser: ADMIN_USER,
  // ADMIN SAMPLE(CRUD용)
  adminSample: ADMIN_SAMPLE,

  // API
  api: API,
};

export default routes;
