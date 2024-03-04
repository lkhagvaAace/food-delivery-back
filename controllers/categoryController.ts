import express from "express";
import Category from "../models/categoryModel";
import { Response, Request } from "express";
import Food from "../models/foodModel";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const preventerFromCoincide = Category.findOne({ name: name });
    if (preventerFromCoincide === null) {
      return res.status(400).json({ message: "Coincide" });
    }
    const newCategory = await Category.create({
      name,
    });
    return res.status(201).send(`${newCategory.id} created`);
  } catch (error) {
    console.error("error in post category controller", error);
    return res.status(400);
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({});
    return res.status(200).send(categories);
  } catch (error) {
    console.error("error in get category controller", error);
    return res.status(404);
  }
};
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const deleteableCategory = await Category.deleteOne({ _id: req.body._id });
    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error("error in deleteCategory", error);
    return res.status(400).json({ message: "Failed to delete" });
  }
};

export const editCategory = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const editableCategory = await Category.updateOne(
      { _id: req.body.category._id },
      { name: req.body.newCategoryName }
    );
    if (editableCategory.matchedCount == 0) {
      return res.status(404).json({ message: "No category found" });
    }
    if (editableCategory.modifiedCount == 0) {
      res.status(400).json({ message: "Failed to update" });
    }
    res.status(200).json({ message: "successfully updated" });
  } catch (error) {
    console.error("error in editCategory", error);
  }
};
