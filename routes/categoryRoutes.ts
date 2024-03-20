import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  editCategory,
  getCategory,
} from "../controllers/categoryController";

export const categoryRouter = Router();
categoryRouter.route("/createCategory").post(createCategory);
categoryRouter.route("/getCategories").get(getCategory);
categoryRouter.route("/deleteCategory").delete(deleteCategory);
categoryRouter.route("/editCategory").put(editCategory);
