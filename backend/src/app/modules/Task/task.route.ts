import { Router } from "express";
import { auth, validateRequest } from "../../middlewares";
import { TaskController } from "./task.controller";
import { TaskValidation } from "./task.validation";

const router = Router();

router
  .route("/")
  .post(
    auth(),
    validateRequest(TaskValidation.createSchema),
    TaskController.createTask
  )
  .get(auth(), TaskController.getAllTasks);

router
  .route("/:id")
  .get(auth(), TaskController.getSingleTask)
  .put(
    auth(),
    validateRequest(TaskValidation.updateSchema),
    TaskController.updateTask
  )
  .delete(auth(), TaskController.deleteTask);

export const TaskRoutes = router;
