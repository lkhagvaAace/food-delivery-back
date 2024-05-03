"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderCount = exports.getOrdersToAdmin = exports.getOrders = exports.createOrder = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const orderNumber = Math.floor(Math.random() * 100000 + 1);
        const totalPrice = req.body.reduce((acc, cur) => acc + cur.count * cur.price, 0);
        const order = yield orderModel_1.default.create({
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
    }
    catch (error) {
        console.error("error in createOrder", error);
        return res.status(400).json({ message: "Failed to createOrder" });
    }
});
exports.createOrder = createOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const orders = yield orderModel_1.default.find({ userId: userId });
        return res.status(200).send(orders);
    }
    catch (error) {
        console.error("error in getOrders", error);
    }
});
exports.getOrders = getOrders;
const getOrdersToAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skip = Number(req.query.skip);
        if (typeof skip != "number")
            return res.status(400);
        const orders = yield orderModel_1.default.find({})
            .populate("userId")
            .limit(8)
            .skip(8 * (skip - 1));
        return res.status(200).send(orders);
    }
    catch (error) {
        console.error("error in getOrders", error);
    }
});
exports.getOrdersToAdmin = getOrdersToAdmin;
const getOrderCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderModel_1.default.find({});
        return res.status(200).json({ message: orders.length });
    }
    catch (error) {
        console.error("error in getOrderCount", error);
    }
});
exports.getOrderCount = getOrderCount;
