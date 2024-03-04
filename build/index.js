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
const express_1 = __importDefault(require("express"));
const userController_1 = require("./controllers/userController");
const body_parser_1 = __importDefault(require("body-parser"));
const connectToDB_1 = require("./connectToDB");
const app = (0, express_1.default)();
(0, connectToDB_1.connectToDB)();
app.use(body_parser_1.default.json(), (0, cors_1.default)({
    origin: "http://localhost:3000",
}));
app.post("/createUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, userController_1.createUser)(req, res);
    }
    catch (error) {
        console.error("error in createUser", error);
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, userController_1.getUser)(req, res);
        res.status(200);
    }
    catch (error) {
        console.error("error in login", error);
    }
}));
app.post("/createOrder", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.body: ", req.body);
    }
    catch (error) {
        console.error("error in createOrder", error);
    }
}));
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
