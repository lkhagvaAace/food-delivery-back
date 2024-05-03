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
// const nodemailer = require("nodemailer");
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const userController_1 = require("./controllers/userController");
const body_parser_1 = __importDefault(require("body-parser"));
const connectToDB_1 = require("./connectToDB");
const orderController_1 = require("./controllers/orderController");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const foodController_1 = require("./controllers/foodController");
const multer_1 = __importDefault(require("./middleware/multer"));
const accessTokenAuth_1 = require("./middleware/accessTokenAuth");
const userRoutes_1 = require("./routes/userRoutes");
const orderRoutes_1 = require("./routes/orderRoutes");
const foodRoutes_1 = require("./routes/foodRoutes");
const categoryRoutes_1 = require("./routes/categoryRoutes");
const orderModel_1 = __importDefault(require("./models/orderModel"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
(0, connectToDB_1.connectToDB)();
app.use(body_parser_1.default.json(), (0, cors_1.default)());
app.use("", userRoutes_1.userRouter);
app.use("", orderRoutes_1.orderRouter);
app.use("", foodRoutes_1.foodRouter);
app.use("", categoryRoutes_1.categoryRouter);
app.post("/createOrder", accessTokenAuth_1.accessTokenAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, orderController_1.createOrder)(req, res);
    }
    catch (error) {
        console.error("error in createOrder", error);
    }
}));
app.get("/getOrders", accessTokenAuth_1.accessTokenAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, orderController_1.getOrders)(req, res);
}));
app.post("/createFood", multer_1.default.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, foodController_1.createFood)(req, res);
}));
app.get("/getUserInfo", accessTokenAuth_1.accessTokenAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, userController_1.getUserInfo)(req, res);
}));
app.put("/updateUser", multer_1.default.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, userController_1.updateUser)(req, res);
}));
app.post("/createInvoice", accessTokenAuth_1.accessTokenAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post("https://merchant.qpay.mn/v2/invoice", {
            invoice_code: "POWER_EXPO_INVOICE",
            sender_invoice_no: "1234567",
            invoice_receiver_code: "terminal",
            invoice_description: "food delivery",
            amount: 10,
            callback_url: "http://localhost:3000",
        }, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        yield orderModel_1.default.findByIdAndUpdate(req.body.orderId, {
            invoiceId: response.data.invoice_id,
        });
        return res.status(201).send(response.data);
    }
    catch (error) {
        console.error("error in create invoice", error);
        return res.status(400).json({ msg: error });
    }
}));
app.post("/checkPayment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const response = yield axios_1.default.post("https://merchant.qpay.mn/v2/payment/check", {
            object_type: "INVOICE",
            object_id: req.body.invoiceId,
            offset: {
                page_number: 1,
                page_limit: 100,
            },
        }, { headers: { Authorization: `Bearer ${req.body.token}` } });
        if (((_a = response.data.rows[0]) === null || _a === void 0 ? void 0 : _a.payment_status) === "PAID") {
            yield orderModel_1.default.findOneAndUpdate({ invoiceId: req.body.invoiceId }, { paymentStatus: "PAID" });
        }
        return res.status(200).send((_b = response.data.rows[0]) === null || _b === void 0 ? void 0 : _b.payment_status);
    }
    catch (error) {
        console.error("error in checkpayment", error);
        return res.status(400).send("Failed");
    }
}));
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
