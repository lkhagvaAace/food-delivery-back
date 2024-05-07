// const nodemailer = require("nodemailer");
import cors from "cors";
import axios from "axios";
import express from "express";
import { getUserInfo, updateUser } from "./controllers/userController";
import bodyParser from "body-parser";
import { connectToDB } from "./connectToDB";
import { createOrder, getOrders } from "./controllers/orderController";
import { Request, Response } from "express";
import { createFood } from "./controllers/foodController";
import upload from "./middleware/multer";
import { accessTokenAuth } from "./middleware/accessTokenAuth";
import { userRouter } from "./routes/userRoutes";
import { orderRouter } from "./routes/orderRoutes";
import { foodRouter } from "./routes/foodRoutes";
import { categoryRouter } from "./routes/categoryRoutes";
import Order from "./models/orderModel";
const app = express();
connectToDB();
app.use(express.json(), cors());
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
app.post(
  "/createInvoice",
  accessTokenAuth,
  async (req: Request, res: Response) => {
    try {
      const response = await axios.post(
        "https://merchant.qpay.mn/v2/invoice",
        {
          invoice_code: "POWER_EXPO_INVOICE",
          sender_invoice_no: "1234567",
          invoice_receiver_code: "terminal",
          invoice_description: "food delivery",
          amount: 10,
          callback_url: "http://localhost:3000",
        },
        {
          headers: {
            Authorization: `Bearer ${req.body.token}`,
          },
        }
      );
      await Order.findByIdAndUpdate(req.body.orderId, {
        invoiceId: response.data.invoice_id,
      });
      return res.status(201).send(response.data);
    } catch (error) {
      console.error("error in create invoice", error);
      return res.status(400).json({ msg: error });
    }
  }
);
app.post("/checkPayment", async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      "https://merchant.qpay.mn/v2/payment/check",
      {
        object_type: "INVOICE",
        object_id: req.body.invoiceId,
        offset: {
          page_number: 1,
          page_limit: 100,
        },
      },
      { headers: { Authorization: `Bearer ${req.body.token}` } }
    );
    if (response.data.rows[0]?.payment_status === "PAID") {
      await Order.findOneAndUpdate(
        { invoiceId: req.body.invoiceId },
        { paymentStatus: "PAID" }
      );
    }
    return res.status(200).send(response.data.rows[0]?.payment_status);
  } catch (error) {
    console.error("error in checkpayment", error);
    return res.status(400).send("Failed");
  }
});
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
