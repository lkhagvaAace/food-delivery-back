import User from "../models/userModel";
import express from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Response, Request } from "express";
import nodemailer from "nodemailer";
import cloudinary from "../utils/Cloudinary";
import { url } from "inspector";

const app = express();
dotenv.config();
const secretKey = process.env.SECRET_KEY as string;
type User = {
  id: string;
};
interface AuthenticatedRequest extends Request {
  user?: any;
}

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
  } catch (error) {
    console.error("error in getUser", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = await req.cookies["refreshToken"];
  if (!refreshToken) {
    return res.status(400).json({ msg: "Access denied" });
  }
  try {
    const decoded = jwt.verify(refreshToken, secretKey) as JwtPayload;
    const accessToken = jwt.sign({ id: decoded.id }, secretKey, {
      expiresIn: "1h",
    });
    return res
      .status(200)
      .header("Authorization", accessToken)
      .json({ id: `${decoded.id}`, accessToken: `${accessToken}` });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Someting wrong in refreshToken" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;
    const emailMatchedUser = await User.findOne({ email: email });
    if (emailMatchedUser) {
      return res.status(401).json({ message: "User already exist" });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name,
      email: email,
      password: encryptedPassword,
      phoneNumber: 0,
      role: "User",
      avatarImg:
        "https://res.cloudinary.com/dl93ggn7x/image/upload/v1710491194/bvkfvotkzfe0ikwznfaa.jpg",
    });
    return res.status(201).send(`${user.email} created`);
  } catch (error) {
    console.error("error in createUser", error);
    return res.status(400).send(error);
  }
};
type user = {
  _id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: number;
  avatarImg: string;
  role: string;
} | null;
export const main = async (user: user, code: number) => {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "lkhagvasurenorgilsaikhan0810@gmail.com",
        pass: "y o c i g l i n y u w y e m h n",
      },
    });
    var mailOptions = {
      from: "lkhagvasurenorgilsaikhan0810@gmail.com",
      to: `${user?.email}`,
      subject: "Sending Email using Node.js",
      text: `${code}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return true;
  } catch (error) {
    console.error(error);
  }
};
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const detectedUser: user = await User.findOne({ email: req.body.email });
    if (!detectedUser) return res.status(404).send("user not found");
    const code = Math.floor(Math.random() * 1000000 + 1);
    const result = await main(detectedUser, code);
    if (result === true) {
      return res.status(200).json({ code: code, _id: detectedUser._id });
    }
    return res.status(400).send("failed");
  } catch (error) {
    console.error("error in verifyEmail", error);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { _id, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.updateOne(
      { _id: _id },
      { password: encryptedPassword }
    );
    if (updatedUser.modifiedCount != 0) {
      return res.status(200).json({ message: "Successfully updated" });
    }
    console.log("updatedUser", updatedUser);
  } catch (error) {
    console.error("error in changePassword", error);
    return res.status(400).json({ message: "Failed to update password" });
  }
};
export const getUserInfo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const loggedInUser = await User.findById(userId);
    return res.status(200).send(loggedInUser);
  } catch (error) {
    console.error("error in getUserInfo", error);
    return res.status(400).json({ message: "User not found" });
  }
};
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = JSON.parse(req.body.user);
    if (!req.file) {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: user.id },
        {
          avatarImg: user.image,
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
        }
      );
    } else {
      const url = await uploadImg(req.file);
      const updatedUser = await User.findByIdAndUpdate(
        { _id: user.id },
        {
          avatarImg: url,
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
        }
      );
    }
    return res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    console.error("error in updateUser", error);
    return res.status(400).json({ message: "failed" });
  }
};
const uploadImg = async (img: any) => {
  try {
    const uploadedFile = img;
    if (!uploadedFile) {
      return false;
    }
    try {
      const newImage = await cloudinary.uploader.upload(uploadedFile.path);
      const image = new User({ avatarImg: newImage.secure_url });
      return image.avatarImg;
    } catch (error) {
      console.error(error);
      return false;
    }
  } catch (error) {
    console.error("error in uploadImg", error);
  }
};
