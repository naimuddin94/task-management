"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../../utils");
const category_service_1 = require("./category.service");
const createCategory = (0, utils_1.asyncHandler)(async (req, res) => {
    const result = await category_service_1.CategoryService.createCategoryIntoDB(req.body);
    res
        .status(http_status_1.default.CREATED)
        .json(new utils_1.AppResponse(http_status_1.default.CREATED, result, 'Category created successfully'));
});
const getAllCategories = (0, utils_1.asyncHandler)(async (req, res) => {
    const result = await category_service_1.CategoryService.getAllCategoriesFromDB();
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'All categories retrieved successfully'));
});
const getSingleCategory = (0, utils_1.asyncHandler)(async (req, res) => {
    const result = await category_service_1.CategoryService.getSingleCategoryFromDB(req.params.id);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'Category retrieved successfully'));
});
const updateCategory = (0, utils_1.asyncHandler)(async (req, res) => {
    const result = await category_service_1.CategoryService.updateCategoryIntoDB(req.params.id, req.body);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'Category updated successfully'));
});
const deleteCategory = (0, utils_1.asyncHandler)(async (req, res) => {
    const result = await category_service_1.CategoryService.deleteCategoryFromDB(req.params.id);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'Category deleted successfully'));
});
exports.CategoryController = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
