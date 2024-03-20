import mongoose, { Schema, model } from "mongoose";

const foodSchema = new Schema({
  name: String,
  category: { type: Schema.ObjectId, ref: "Category", required: true },
  ingredients: String,
  price: Number,
  isSale: Object || Boolean,
  img: String,
});
const Food = model("Food", foodSchema);
export default Food;
