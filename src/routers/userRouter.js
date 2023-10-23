import express from "express";
import routes from "../routes";
import { user } from "../controllers/userController";

const userRouter = express.Router();

// 유저 User
userRouter.get("/", user);

export default userRouter;
