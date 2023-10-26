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
const ADMIN_PRODUCT = "/product";
const ADMIN_MAGAZINE = "/magazine";
// //Product (새로 생성)
// const PRODUCT = "/product";
// const PRODUCT_REGISTER = "/register";
// const PRODUCT_LOGIN = "/login";
// const PRODUCT_LOGOUT = "/logout";
// const PRODUCT_CHANGE_PW = "/change-pw";
// const PRODUCT_USER = "/user";
// // PRODUCT Content(CRUD용)
// const PRODUCT_SAMPLE = "/sample";
// const PRODUCT_MAGAZINE = "/magazine";

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
  // ADMIN PRODUCT(CRUD용)
  adminProduct: ADMIN_PRODUCT,
  adminMagazine: ADMIN_MAGAZINE,

  // // Product
  // product: PRODUCT,
  // productRegister: PRODUCT_REGISTER,
  // productLogin: PRODUCT_LOGIN,
  // productLogout: PRODUCT_LOGOUT,
  // productChangePW: PRODUCT_CHANGE_PW,
  // productUser: PRODUCT_USER,

  // // Product Content(CRUD용)
  // productSample: PRODUCT_SAMPLE,
  // productMagazine: PRODUCT_MAGAZINE,

  // API
  api: API,
};

export default routes;
