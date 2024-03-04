// const nodemailer = require("nodemailer");
import cors from "cors";
import express from "express";
import { createUser, getUser, verifyEmail } from "./controllers/userController";
import bodyParser from "body-parser";
import { connectToDB } from "./connectToDB";
import { createOrder } from "./controllers/orderController";
import { Request, Response } from "express";

import {
  createCategory,
  deleteCategory,
  editCategory,
  getCategory,
} from "./controllers/categoryController";
import { createFood, getFoods } from "./controllers/foodController";
import multer from "multer";
import upload from "./middleware/multer";
import Food from "./models/foodModel";
import cloudinary from "./utils/Cloudinary";
// express.json();
const app = express();
connectToDB();
app.use(
  bodyParser.json(),
  cors({
    origin: "*",
  })
);
app.post("/createUser", async (req: Request, res: Response) => {
  try {
    createUser(req, res);
  } catch (error) {
    console.error("error in createUser", error);
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    getUser(req, res);
    res.status(200);
  } catch (error) {
    console.error("error in login", error);
  }
});

app.post("/createOrder", async (req: Request, res: Response) => {
  try {
    createOrder(req, res);
  } catch (error) {
    console.error("error in createOrder", error);
  }
});

app.post("/verifyEmail", async (req: Request, res: Response) => {
  try {
    verifyEmail(req, res);
  } catch (error) {
    console.error("error in changePassword", error);
  }
});

app.post("/createCategory", async (req: Request, res: Response) => {
  try {
    createCategory(req, res);
  } catch (error) {
    console.error("error in createCategory", error);
  }
});
app.get("/getCategories", async (req: Request, res: Response) => {
  try {
    getCategory(req, res);
  } catch (error) {
    console.error("error in createCategory", error);
  }
});
app.post(
  "/createFood",
  upload.single("image"),
  async (req: Request, res: Response) => {
    createFood(req, res);
  }
);
app.get("/getFoods", async (req: Request, res: Response) => {
  getFoods(req, res);
});
app.delete("/deleteCategory", async (req: Request, res: Response) => {
  deleteCategory(req, res);
});
app.put("/editCategory", async (req: Request, res: Response) => {
  editCategory(req, res);
});

// app.use("/upload", upload.single("image"), async (req, res) => {
//   const uploadedFile = req.file;
//   if (!uploadedFile) {
//     return res.status(404).json({ message: "please upload a file" });
//   }
//   try {
//     const newImage = await cloudinary.uploader.upload(uploadedFile.path);
//     const image = new Food({ img: newImage.secure_url });
//     await image.save();
//     return res.status(201).json({ message: "success", image: image });
//   } catch (error) {
//     console.error(error);
//     return res.status(400).json({ message: "failed" });
//   }
// });
const PORT = 3005;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
