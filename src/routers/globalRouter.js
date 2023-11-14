import paginate from "express-paginate";
import express from "express";
import routes from "../routes";
import {
  getHome,
  postHome,
  product,
  productDetail,
  getLogin,
  postLogin,
  getLogout,
  getAdminRegister,
  postAdminRegister,
} from "../controllers/globalController";

const globalRouter = express.Router();

// 홈 Home
globalRouter.get(routes.home, getHome);
// globalRouter.post(routes.home, postHome);

// 상품 Product
globalRouter.get(routes.adminProduct, paginate.middleware(20, 50), product);

// 상품 상세페이지
globalRouter.get(`${routes.adminProduct}/:id([0-9a-f]{24})`, productDetail);

// 로그인
globalRouter.get(routes.login, getLogin);
globalRouter.post(routes.login, postLogin);

//로그아웃
globalRouter.get(routes.logout, getLogout);

// 회원가입
globalRouter.get(routes.adminRegister, getAdminRegister);
globalRouter.post(routes.adminRegister, postAdminRegister);
export default globalRouter;
