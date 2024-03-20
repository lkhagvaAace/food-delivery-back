// const nodemailer = require("nodemailer");
import cors from "cors";
import express from "express";
import { getUserInfo, updateUser } from "./controllers/userController";
import bodyParser from "body-parser";
import { connectToDB } from "./connectToDB";
import { createOrder, getOrders } from "./controllers/orderController";
import { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { createFood } from "./controllers/foodController";
import upload from "./middleware/multer";
import { accessTokenAuth } from "./middleware/accessTokenAuth";
import { userRouter } from "./routes/userRoutes";
import { orderRouter } from "./routes/orderRoutes";
import { foodRouter } from "./routes/foodRoutes";
import { categoryRouter } from "./routes/categoryRoutes";
const app = express();
app.use(cookieParser());
connectToDB();
app.use(
  bodyParser.json(),
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use("", userRouter);
app.use("", orderRouter);
app.use("", foodRouter);
app.use("", categoryRouter);

app.post(
  "/createOrder",
  accessTokenAuth,
  async (req: Request, res: Response) => {
    try {
      createOrder(req, res);
    } catch (error) {
      console.error("error in createOrder", error);
    }
  }
);
app.get("/getOrders", accessTokenAuth, async (req: Request, res: Response) => {
  getOrders(req, res);
});
app.post(
  "/createFood",
  upload.single("image"),
  async (req: Request, res: Response) => {
    createFood(req, res);
  }
);
app.get(
  "/getUserInfo",
  accessTokenAuth,
  async (req: Request, res: Response) => {
    getUserInfo(req, res);
  }
);
app.put(
  "/updateUser",
  upload.single("image"),
  async (req: Request, res: Response) => {
    updateUser(req, res);
  }
);
const PORT = 3005;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
