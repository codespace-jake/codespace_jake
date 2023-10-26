import paginate from "express-paginate";
import express from "express";
import routes from "../routes";

import { onlyAdmin, uploadSampleImg } from "../middlewares";
import { get관리자로그인, post관리자로그인, 로그아웃 } from "../jake/admin/sign";
import { get관리자회원가입, post관리자회원가입 } from "../jake/admin/register";

import { adminSampleData, getAdminSampleDataCrud, postAdminSampleDataCrud } from "../jake/admin/adminSampleData";
import { adminMagazineData, getAdminMagazineDataCrud, postAdminMagazineDataCrud } from "../jake/admin/adminMagazineData";
import { adminUser, adminUserApprove, adminUserDelete } from "../jake/admin/adminUser";

const productRouter = express.Router();

// 관리자 로그인
productRouter.get("/", get관리자로그인).post(routes.productLogin, post관리자로그인);

// 관리자 회원가입
productRouter.get(routes.adminRegister, get관리자회원가입).post(routes.adminRegister, post관리자회원가입);

// 로그아웃
productRouter.get(routes.productLogout, onlyAdmin, 로그아웃);

// TODO 비밀번호 변경
// productRouter.get(`${routes.adminChangePW}`, onlyAdmin, getAdminChangePW);
// productRouter.post(`${routes.adminChangePW}`, onlyAdmin, postAdminChangePW);

// 관리자 계정 관리
productRouter.get(`${routes.productUser}`, onlyAdmin, paginate.middleware(20, 50), adminUser);
productRouter.get(`${routes.productUser}/approve/:userID`, onlyAdmin, adminUserApprove);
productRouter.get(`${routes.productUser}/delete/:userID`, onlyAdmin, adminUserDelete);

// 관리자 샘플 관리
productRouter.get(`${routes.productSample}`, onlyAdmin, paginate.middleware(20, 50), adminSampleData);
productRouter.get(`${routes.productSample}/:crudType`, onlyAdmin, getAdminSampleDataCrud);
productRouter.post(`${routes.productSample}/:crudType`, onlyAdmin, uploadSampleImg, postAdminSampleDataCrud);

// 관리자 메거진 관리
productRouter.get(`${routes.productMagazine}`, onlyAdmin, paginate.middleware(20, 50), adminMagazineData);
productRouter.get(`${routes.productMagazine}/:crudType`, onlyAdmin, getAdminMagazineDataCrud);
productRouter.post(`${routes.productMagazine}/:crudType`, onlyAdmin, postAdminMagazineDataCrud);

export default productRouter;
