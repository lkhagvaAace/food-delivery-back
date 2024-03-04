import mongoose, { Schema, model } from "mongoose";

const foodSchema = new Schema({
  name: String,
  category: String,
  ingredients: String,
  price: Number,
  isSale: Object || Boolean,
  img: String,
});
const Food = model("Food", foodSchema);
export default Food;
