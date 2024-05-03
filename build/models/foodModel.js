"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const foodSchema = new mongoose_1.Schema({
    name: String,
    category: { type: mongoose_1.Schema.ObjectId, ref: "Category", required: true },
    ingredients: String,
    price: Number,
    isSale: Object || Boolean,
    img: String,
});
const Food = (0, mongoose_1.model)("Food", foodSchema);
exports.default = Food;
