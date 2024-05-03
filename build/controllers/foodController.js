"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFoods = exports.createFood = void 0;
const foodModel_1 = __importDefault(require("../models/foodModel"));
const Cloudinary_1 = __importDefault(require("../utils/Cloudinary"));
const createFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const food = JSON.parse(req.body.newFood);
        const { name, category, ingredients, price, isSale } = food;
        const url = yield uploadImg(req.file);
        const newFood = yield foodModel_1.default.create({
            name: name,
            category: category,
            ingredients: ingredients,
            price: price,
            isSale: isSale,
            img: url,
        });
        return res.status(201).json({ message: `${newFood.id}` });
    }
    catch (error) {
        console.error("error in createFood", error);
        return res.status(400).json({ message: "couldn't create new food" });
    }
});
exports.createFood = createFood;
const getFoods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foods = yield foodModel_1.default.find({});
        if (!foods)
            return res.status(400).json({ message: "your menu is empty" });
        return res.status(200).send(foods);
    }
    catch (error) {
        console.error("error in getFood", error);
        return res.status(404).json({ message: "couldn't get food" });
    }
});
exports.getFoods = getFoods;
const uploadImg = (img) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFile = img;
        if (!uploadedFile) {
            return false;
        }
        try {
            const newImage = yield Cloudinary_1.default.uploader.upload(uploadedFile.path);
            const image = new foodModel_1.default({ img: newImage.secure_url });
            return image.img;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    catch (error) {
        console.error("error in uploadImg", error);
    }
});
