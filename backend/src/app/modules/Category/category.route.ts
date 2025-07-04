import { Router } from "express";
import { auth, validateRequest } from "../../middlewares";
import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = Router();

router
  .route("/")
  .post(
    auth(),
    validateRequest(CategoryValidation.createSchema),
    CategoryController.createCategory
  )
  .get(CategoryController.getAllCategories);

router
  .route("/:id")
  .get(CategoryController.getSingleCategory)
  .put(
    auth(),
    validateRequest(CategoryValidation.updateSchema),
    CategoryController.updateCategory
  )
  .delete(auth(), CategoryController.deleteCategory);

export const CategoryRoutes = router;
