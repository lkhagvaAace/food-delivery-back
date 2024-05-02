import { Response, Request } from "express";
import Order from "../models/orderModel";
interface AuthenticatedRequest extends Request {
  user?: any;
}
export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const orderNumber = Math.floor(Math.random() * 100000 + 1);
    const totalPrice = req.body.reduce(
      (acc: number, cur: any) => acc + cur.count * cur.price,
      0
    );
    const order = await Order.create({
      userId: userId,
      orderNumber,
      foods: req.body,
      totalPrice,
      process: "Waiting",
      createdDate: `${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDate()}`,
      district: "KHUD",
      khoroo: "4",
      apartment: "Viva",
    });
    return res.status(201).json({ id: order._id });
  } catch (error) {
    console.error("error in createOrder", error);
    return res.status(400).json({ message: "Failed to createOrder" });
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId: userId });
    return res.status(200).send(orders);
  } catch (error) {
    console.error("error in getOrders", error);
  }
};
export const getOrdersToAdmin = async (req: Request, res: Response) => {
  try {
    const skip: number = Number(req.query.skip);
    if (typeof skip != "number") return res.status(400);
    const orders = await Order.find({})
      .populate("userId")
      .limit(8)
      .skip(8 * (skip - 1));
    return res.status(200).send(orders);
  } catch (error) {
    console.error("error in getOrders", error);
  }
};
export const getOrderCount = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({});
    return res.status(200).json({ message: orders.length });
  } catch (error) {
    console.error("error in getOrderCount", error);
  }
};
