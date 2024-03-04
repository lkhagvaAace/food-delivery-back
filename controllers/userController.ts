import User from "../models/userModel";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Response, Request } from "express";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

dotenv.config();
const app = express();

const secretKey = process.env.SECRET_KEY as string;

export const getUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const emailMatchedUser = await User.findOne({ email: email });
    if (emailMatchedUser === null) {
      return res.status(205).send("User Not Found");
    }
    if (!emailMatchedUser.password) {
      return false;
    }
    const result = await bcrypt.compare(password, emailMatchedUser.password);
    if (!result) return res.status(206).send("Wrond Password");
    const accessToken = jwt.sign(
      {
        id: emailMatchedUser.id,
      },
      secretKey,
      { expiresIn: "10h" }
    );
    const refreshToken = jwt.sign(
      {
        id: emailMatchedUser.id,
      },
      secretKey,
      { expiresIn: "1d" }
    );
    res.json({ message: `${emailMatchedUser.id}` });
    // res
    //   .status(200)
    //   .cookie("refreshToken", refreshToken)
    //   .header({ Authorization: accessToken })
    //   .send(emailMatchedUser);
  } catch (error) {
    console.error("error in getUser", error);
    return res.status(404);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    console.log(encryptedPassword);
    const user = await User.create({
      name: name,
      email: email,
      password: encryptedPassword,
      phoneNumber: 99921902,
      role: "User",
    });
    return res.status(201).send(`${user.email} created`);
  } catch (error) {
    console.error("error in createUser", error);
    return res.status(400).send(error);
  }
};
export const main = async () => {
  try {
    var transporter = nodemailer.createTransport({
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
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.error(error);
  }
};
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const detectedUser = await User.findOne({ email: req.body.email });
    if (!detectedUser) return res.status(404).send("user not found");
    main();
    return res.status(200).send("successfully detected");
  } catch (error) {
    console.error("error in verifyEmail");
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.error("error in changePassword", error);
  }
};
