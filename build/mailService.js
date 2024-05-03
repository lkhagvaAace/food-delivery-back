"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
var transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "ace.orgil@gmail.com",
        pass: "Ace_lkhagva0810",
    },
});
var mailOptions = {
    from: "ace.orgil@gmail.com",
    to: "lkhagvasurenorgilsaikhan0810@gmail.com",
    subject: "Sending Email using Node.js",
    text: "That was easy!",
};
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Email sent: " + info.response);
    }
});
