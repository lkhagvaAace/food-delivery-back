"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.ObjectId,
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
const Order = (0, mongoose_1.model)("Order", orderSchema);
exports.default = Order;
