import { Router } from "express";
import { createUser, getUser } from "../controllers/userController";
export const userRouter = Router();

userRouter.get("/getUsers").post("/createUser");
