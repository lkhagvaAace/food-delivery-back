import { Router } from "express";
import {
  getOrderCount,
  getOrdersToAdmin,
} from "../controllers/orderController";
export const orderRouter = Router();

orderRouter.route("/getOrdersToAdmin").get(getOrdersToAdmin);
orderRouter.route("/getOrderCount").get(getOrderCount);
