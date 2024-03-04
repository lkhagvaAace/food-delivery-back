import mongoose, { Schema, model } from "mongoose";
import { ObjectId } from "mongoose";

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
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
  createdDate: Date,
  district: String,
  khoroo: String,
  apartment: String,
});
const Order = model("Order", orderSchema);
export default Order;
