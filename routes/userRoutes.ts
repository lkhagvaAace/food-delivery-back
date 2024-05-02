import { Router } from "express";
import {
  changePassword,
  createUser,
  getUser,
  verifyEmail,
} from "../controllers/userController";
export const userRouter = Router();

userRouter.route("/createUser").post(createUser);
userRouter.route("/changePassword").put(changePassword);
userRouter.route("/verifyEmail").post(verifyEmail);
userRouter.route("/login").post(getUser);
