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
exports.createUser = exports.getUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const secretKey = process.env.SECRET_KEY;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const emailMatchedUser = yield userModel_1.default.findOne({ email: email });
        if (emailMatchedUser === null) {
            return res.status(205).send("User Not Found");
        }
        if (!emailMatchedUser.password) {
            return false;
        }
        const result = yield bcrypt_1.default.compare(password, emailMatchedUser.password);
        if (!result)
            return res.status(206).send("Wrond Password");
        const accessToken = jsonwebtoken_1.default.sign({
            id: emailMatchedUser.id,
        }, secretKey, { expiresIn: "10h" });
        const refreshToken = jsonwebtoken_1.default.sign({
            id: emailMatchedUser.id,
        }, secretKey, { expiresIn: "1d" });
        res.json({ message: `${emailMatchedUser.id}` });
        // res
        //   .status(200)
        //   .cookie("refreshToken", refreshToken)
        //   .header({ Authorization: accessToken })
        //   .send(emailMatchedUser);
    }
    catch (error) {
        console.error("error in getUser", error);
    }
});
exports.getUser = getUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phoneNumber, role } = req.body;
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        console.log(encryptedPassword);
        const user = yield userModel_1.default.create({
            name: name,
            email: email,
            password: encryptedPassword,
            phoneNumber: 99921902,
            role: "User",
        });
        return res.status(203).send(`${user.email} created`);
    }
    catch (error) {
        console.error("error in createUser", error);
        return res.status(500).send(error);
    }
});
exports.createUser = createUser;
