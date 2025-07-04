import status from 'http-status';
import { asyncHandler, AppResponse } from '../../utils';
import { CategoryService } from './category.service';

const createCategory = asyncHandler(async (req, res) => {
  const result = await CategoryService.createCategoryIntoDB(req.body);

  res
    .status(status.CREATED)
    .json(new AppResponse(status.CREATED, result, 'Category created successfully'));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const result = await CategoryService.getAllCategoriesFromDB();

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'All categories retrieved successfully'));
});

const getSingleCategory = asyncHandler(async (req, res) => {
  const result = await CategoryService.getSingleCategoryFromDB(req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Category retrieved successfully'));
});

const updateCategory = asyncHandler(async (req, res) => {
  const result = await CategoryService.updateCategoryIntoDB(req.params.id, req.body);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Category updated successfully'));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const result = await CategoryService.deleteCategoryFromDB(req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Category deleted successfully'));
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
