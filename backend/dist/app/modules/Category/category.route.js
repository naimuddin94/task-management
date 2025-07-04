"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const category_controller_1 = require("./category.controller");
const router = (0, express_1.Router)();
router
    .route("/")
    .post((0, middlewares_1.auth)(), category_controller_1.CategoryController.createCategory)
    .get(category_controller_1.CategoryController.getAllCategories);
router
    .route("/:id")
    .get(category_controller_1.CategoryController.getSingleCategory)
    .put(category_controller_1.CategoryController.updateCategory)
    .delete(category_controller_1.CategoryController.deleteCategory);
exports.CategoryRoutes = router;
