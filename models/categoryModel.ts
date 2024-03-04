import mongoose, { Schema, model } from "mongoose";
import { ObjectId } from "mongoose";

const categorySchema = new Schema({
  name: String,
  foodId: "ObjectId",
});
const Category = model("Category", categorySchema);
export default Category;
