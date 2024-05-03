"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
exports.orderRouter = (0, express_1.Router)();
exports.orderRouter.route("/getOrdersToAdmin").get(orderController_1.getOrdersToAdmin);
exports.orderRouter.route("/getOrderCount").get(orderController_1.getOrderCount);
