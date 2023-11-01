import express from "express";
import routes from "../routes";
import { home, product } from "../controllers/globalController";

const globalRouter = express.Router();

// 홈 Home
globalRouter.get(routes.home, home);
globalRouter.get(routes.adminProduct, product);

export default globalRouter;
