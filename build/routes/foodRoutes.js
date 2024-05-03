"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodRouter = void 0;
const express_1 = require("express");
const foodController_1 = require("../controllers/foodController");
exports.foodRouter = (0, express_1.Router)();
exports.foodRouter.route("/getFoods").get(foodController_1.getFoods);
