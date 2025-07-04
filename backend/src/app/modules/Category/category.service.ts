import status from "http-status";
import { AppError } from "../../utils";
import Category from "./category.model";
import { TCategoryPayload } from "./category.validation";
import { Types } from "mongoose";

// Create a new category
const createCategoryIntoDB = async (payload: TCategoryPayload) => {
  const existing = await Category.findOne({ name: payload.name });

  if (existing) {
    throw new AppError(
      status.CONFLICT,
      "Category with this name already exists"
    );
  }

  return await Category.create(payload);
};

// Get all categories
const getAllCategoriesFromDB = async () => {
  const categories = await Category.find();
  return categories;
};

// Get single category by ID
const getSingleCategoryFromDB = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid category ID");
  }

  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  return category;
};

// Update category by ID
const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<TCategoryPayload>
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid category ID");
  }

  const category = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  return category;
};

// Delete category by ID
const deleteCategoryFromDB = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid category ID");
  }

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  return category;
};

export const CategoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
