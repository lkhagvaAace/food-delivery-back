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
exports.updateUser = exports.getUserInfo = exports.changePassword = exports.verifyEmail = exports.main = exports.createUser = exports.refreshToken = exports.getUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const Cloudinary_1 = __importDefault(require("../utils/Cloudinary"));
const app = (0, express_1.default)();
dotenv_1.default.config();
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
        res
            .status(200)
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
        })
            .header("Authorization", accessToken)
            .json({
            emailMatchedUser: `${emailMatchedUser}`,
            accessToken: `${accessToken}`,
        });
    }
    catch (error) {
        console.error("error in getUser", error);
        return res.status(500).send("Internal Server Error");
    }
});
exports.getUser = getUser;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = yield req.cookies["refreshToken"];
    if (!refreshToken) {
        return res.status(400).json({ msg: "Access denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, secretKey);
        const accessToken = jsonwebtoken_1.default.sign({ id: decoded.id }, secretKey, {
            expiresIn: "1h",
        });
        return res
            .status(200)
            .header("Authorization", accessToken)
            .json({ id: `${decoded.id}`, accessToken: `${accessToken}` });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ msg: "Someting wrong in refreshToken" });
    }
});
exports.refreshToken = refreshToken;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phoneNumber, role } = req.body;
        const emailMatchedUser = yield userModel_1.default.findOne({ email: email });
        if (emailMatchedUser) {
            return res.status(401).json({ message: "User already exist" });
        }
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield userModel_1.default.create({
            name: name,
            email: email,
            password: encryptedPassword,
            phoneNumber: 0,
            role: "User",
            avatarImg: "https://res.cloudinary.com/dl93ggn7x/image/upload/v1710491194/bvkfvotkzfe0ikwznfaa.jpg",
        });
        return res.status(201).send(`${user.email} created`);
    }
    catch (error) {
        console.error("error in createUser", error);
        return res.status(400).send(error);
    }
});
exports.createUser = createUser;
const main = (user, code) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "lkhagvasurenorgilsaikhan0810@gmail.com",
                pass: "y o c i g l i n y u w y e m h n",
            },
        });
        var mailOptions = {
            from: "lkhagvasurenorgilsaikhan0810@gmail.com",
            to: `${user === null || user === void 0 ? void 0 : user.email}`,
            subject: "Sending Email using Node.js",
            text: `${code}`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email sent: " + info.response);
            }
        });
        return true;
    }
    catch (error) {
        console.error(error);
    }
});
exports.main = main;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const detectedUser = yield userModel_1.default.findOne({ email: req.body.email });
        if (!detectedUser)
            return res.status(404).send("user not found");
        const code = Math.floor(Math.random() * 1000000 + 1);
        const result = yield (0, exports.main)(detectedUser, code);
        if (result === true) {
            return res.status(200).json({ code: code, _id: detectedUser._id });
        }
        return res.status(400).send("failed");
    }
    catch (error) {
        console.error("error in verifyEmail", error);
    }
});
exports.verifyEmail = verifyEmail;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, password } = req.body;
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        const updatedUser = yield userModel_1.default.updateOne({ _id: _id }, { password: encryptedPassword });
        if (updatedUser.modifiedCount != 0) {
            return res.status(200).json({ message: "Successfully updated" });
        }
        console.log("updatedUser", updatedUser);
    }
    catch (error) {
        console.error("error in changePassword", error);
        return res.status(400).json({ message: "Failed to update password" });
    }
});
exports.changePassword = changePassword;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const loggedInUser = yield userModel_1.default.findById(userId);
        return res.status(200).send(loggedInUser);
    }
    catch (error) {
        console.error("error in getUserInfo", error);
        return res.status(400).json({ message: "User not found" });
    }
});
exports.getUserInfo = getUserInfo;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(req.body.user);
        if (!req.file) {
            const updatedUser = yield userModel_1.default.findByIdAndUpdate({ _id: user.id }, {
                avatarImg: user.image,
                name: user.name,
                phoneNumber: user.phoneNumber,
                email: user.email,
            });
        }
        else {
            const url = yield uploadImg(req.file);
            const updatedUser = yield userModel_1.default.findByIdAndUpdate({ _id: user.id }, {
                avatarImg: url,
                name: user.name,
                phoneNumber: user.phoneNumber,
                email: user.email,
            });
        }
        return res.status(200).json({ message: "Successfully updated" });
    }
    catch (error) {
        console.error("error in updateUser", error);
        return res.status(400).json({ message: "failed" });
    }
});
exports.updateUser = updateUser;
const uploadImg = (img) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFile = img;
        if (!uploadedFile) {
            return false;
        }
        try {
            const newImage = yield Cloudinary_1.default.uploader.upload(uploadedFile.path);
            const image = new userModel_1.default({ avatarImg: newImage.secure_url });
            return image.avatarImg;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    catch (error) {
        console.error("error in uploadImg", error);
    }
});
