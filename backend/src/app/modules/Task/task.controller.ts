import status from "http-status";
import { asyncHandler, AppResponse } from "../../utils";
import { TaskService } from "./task.service";

// Create a new task
const createTask = asyncHandler(async (req, res) => {
  const result = await TaskService.createTaskIntoDB(req.user, req.body);

  res
    .status(status.CREATED)
    .json(new AppResponse(status.CREATED, result, "Task created successfully"));
});

// Get all tasks
const getAllTasks = asyncHandler(async (req, res) => {
  const result = await TaskService.getAllTasksFromDB(req.user, req.query);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result.data,
        "All tasks retrieved successfully",
        result.meta
      )
    );
});

// Get single task by ID
const getSingleTask = asyncHandler(async (req, res) => {
  const result = await TaskService.getSingleTaskFromDB(req.user, req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, "Task retrieved successfully"));
});

// Update task
const updateTask = asyncHandler(async (req, res) => {
  const result = await TaskService.updateTaskIntoDB(
    req.user,
    req.params.id,
    req.body
  );

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, "Task updated successfully"));
});

// Delete task
const deleteTask = asyncHandler(async (req, res) => {
  const result = await TaskService.deleteTaskFromDB(req.user, req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, "Task deleted successfully"));
});

export const TaskController = {
  createTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  deleteTask,
};
