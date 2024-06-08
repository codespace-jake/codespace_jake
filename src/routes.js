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
// ADMIN PRODUCT(CRUD용)
const ADMIN_PRODUCT = "/product";
// ADMIN MAGAZINE(CRUD용)
const ADMIN_MAGAZINE = "/magazine";

// API
const API = "/api";

//Dummy Data upload용 (test)
const DUMMY = "/dummy";






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
  // ADMIN PRODUCT(CRUD용)
  adminProduct: ADMIN_PRODUCT,
  // ADMIN MAGAZINE(CRUD용)
  adminMagazine: ADMIN_MAGAZINE,

  // API
  api: API,

  //Dummy Data upload용 (test)
  dummy: DUMMY,
};

export default routes;
