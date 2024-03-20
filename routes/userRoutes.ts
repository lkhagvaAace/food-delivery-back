import { Router } from "express";
import {
  changePassword,
  createUser,
  verifyEmail,
} from "../controllers/userController";
export const userRouter = Router();

userRouter.route("/createUser").post(createUser);
userRouter.route("/changePassword").put(changePassword);
userRouter.route("/verifyEmail").post(verifyEmail);
