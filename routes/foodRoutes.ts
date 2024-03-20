import { Router } from "express";
import { getFoods } from "../controllers/foodController";
export const foodRouter = Router();
foodRouter.route("/getFoods").get(getFoods);
