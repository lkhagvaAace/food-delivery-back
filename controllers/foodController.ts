import { Request, Response } from "express";
import Food from "../models/foodModel";
import cloudinary from "../utils/Cloudinary";
export const createFood = async (req: Request, res: Response) => {
  try {
    const food = JSON.parse(req.body.newFood);
    const { name, category, ingredients, price, isSale } = food;
    const url = await uploadImg(req.file);
    console.log(url);
    const newFood = await Food.create({
      name: name,
      category: category,
      ingredients: ingredients,
      price: price,
      isSale: isSale,
      img: url,
    });
    console.log(name, category, ingredients, price, isSale, req.body);
    return res.status(201).json({ message: `${newFood.id}` });
  } catch (error) {
    console.error("error in createFood", error);
    return res.status(400).json({ message: "couldn't create new food" });
  }
};

export const getFoods = async (req: Request, res: Response) => {
  try {
    const foods = await Food.find({});
    if (!foods) return res.status(400).json({ message: "your menu is empty" });
    return res.status(200).send(foods);
  } catch (error) {
    console.error("error in getFood", error);
    return res.status(404).json({ message: "couldn't get food" });
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
      const image = new Food({ img: newImage.secure_url });
      await image.save();
      return image.img;
    } catch (error) {
      console.error(error);
      return false;
    }
  } catch (error) {
    console.error("error in uploadImg", error);
  }
};
