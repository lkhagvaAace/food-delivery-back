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
exports.editCategory = exports.deleteCategory = exports.getCategory = exports.createCategory = void 0;
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const preventerFromCoincide = categoryModel_1.default.findOne({ name: name });
        if (preventerFromCoincide === null) {
            return res.status(400).json({ message: "Coincide" });
        }
        const newCategory = yield categoryModel_1.default.create({
            name,
        });
        return res.status(201).send(`${newCategory.id} created`);
    }
    catch (error) {
        console.error("error in post category controller", error);
        return res.status(400);
    }
});
exports.createCategory = createCategory;
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categoryModel_1.default.find({});
        return res.status(200).send(categories);
    }
    catch (error) {
        console.error("error in get category controller", error);
        return res.status(404);
    }
});
exports.getCategory = getCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteableCategory = yield categoryModel_1.default.deleteOne({ _id: req.body._id });
        return res.status(200).json({ message: "Deleted" });
    }
    catch (error) {
        console.error("error in deleteCategory", error);
        return res.status(400).json({ message: "Failed to delete" });
    }
});
exports.deleteCategory = deleteCategory;
const editCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const editableCategory = yield categoryModel_1.default.updateOne({ _id: req.body.category._id }, { name: req.body.newCategoryName });
        if (editableCategory.matchedCount == 0) {
            return res.status(404).json({ message: "No category found" });
        }
        if (editableCategory.modifiedCount == 0) {
            res.status(400).json({ message: "Failed to update" });
        }
        res.status(200).json({ message: "successfully updated" });
    }
    catch (error) {
        console.error("error in editCategory", error);
    }
});
exports.editCategory = editCategory;
