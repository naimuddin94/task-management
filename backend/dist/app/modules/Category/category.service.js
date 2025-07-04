"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../../utils");
const category_model_1 = __importDefault(require("./category.model"));
const mongoose_1 = require("mongoose");
// Create a new category
const createCategoryIntoDB = async (payload) => {
    const existing = await category_model_1.default.findOne({ name: payload.name });
    if (existing) {
        throw new utils_1.AppError(http_status_1.default.CONFLICT, "Category with this name already exists");
    }
    return await category_model_1.default.create(payload);
};
// Get all categories
const getAllCategoriesFromDB = async () => {
    const categories = await category_model_1.default.find();
    return categories;
};
// Get single category by ID
const getSingleCategoryFromDB = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid category ID");
    }
    const category = await category_model_1.default.findById(id);
    if (!category) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "Category not found");
    }
    return category;
};
// Update category by ID
const updateCategoryIntoDB = async (id, payload) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid category ID");
    }
    const category = await category_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!category) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "Category not found");
    }
    return category;
};
// Delete category by ID
const deleteCategoryFromDB = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid category ID");
    }
    const category = await category_model_1.default.findByIdAndDelete(id);
    if (!category) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "Category not found");
    }
    return category;
};
exports.CategoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    getSingleCategoryFromDB,
    updateCategoryIntoDB,
    deleteCategoryFromDB,
};
