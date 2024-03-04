import express from "express";
import { Schema } from "mongoose";
import Order from "../models/orderModel";

export const createOrder = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId, orderNumber, foods, totalPrice, process, createdDate } =
      req.body;
    const order = await Order.create({
      userId: userId,
      orderNumber,
      foods,
      totalPrice,
      process,
      createdDate,
      district: "KHUD",
      khoroo: "4",
      apartment: "Viva",
    });
    return res.status(201).json({ message: `${order}` });
  } catch (error) {
    console.error("error in createOrder", error);
    return res.status(400);
  }
};
