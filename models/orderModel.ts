import mongoose, { Schema, model } from "mongoose";
import { ObjectId } from "mongoose";

const orderSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  orderNumber: Number,
  foods: Array,
  totalPrice: Number,
  process: {
    type: String,
    enum: ["Waiting", "Progress", "Delivered"],
  },
  paymentStatus: {
    type: String,
    enum: ["PAID", "NOTPAID"],
    default: "NOTPAID",
  },
  invoiceId: String,
  createdDate: String,
  district: String,
  khoroo: String,
  apartment: String,
});
const Order = model("Order", orderSchema);
export default Order;
