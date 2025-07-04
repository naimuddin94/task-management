import QueryBuilder from "mongoose-query-builders";
import { IUser } from "./../User/user.interface";
import status from "http-status";
import { AppError } from "../../utils";
import Task from "./task.model";
import { TTaskPayload } from "./task.validation";
import { Types } from "mongoose";

// Create a new task
const createTaskIntoDB = async (
  user: IUser,
  payload: TTaskPayload & { user: string }
) => {
  const existing = await Task.findOne({ title: payload.title, user: user._id });
  if (existing) {
    throw new AppError(status.CONFLICT, "Task with this title already exists");
  }

  payload.user = user._id as string;

  return await Task.create(payload);
};

// Get all tasks
const getAllTasksFromDB = async (query: Record<string, unknown>) => {
  const taskQuery = new QueryBuilder(Task.find().populate("category"), query)
    .search(["title", "priority", "description"])
    .filter()
    .sort()
    .fields()
    .paginate();
};

// Get single task by ID
const getSingleTaskFromDB = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid task ID");
  }

  const task = await Task.findById(id).populate("category");

  if (!task) {
    throw new AppError(status.NOT_FOUND, "Task not found");
  }

  return task;
};

// Update task by ID
const updateTaskIntoDB = async (id: string, payload: Partial<TTaskPayload>) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid task ID");
  }

  const task = await Task.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("categoryId");

  if (!task) {
    throw new AppError(status.NOT_FOUND, "Task not found");
  }

  return task;
};

// Delete task by ID
const deleteTaskFromDB = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid task ID");
  }

  const task = await Task.findByIdAndDelete(id);

  if (!task) {
    throw new AppError(status.NOT_FOUND, "Task not found");
  }

  return task;
};

export const TaskService = {
  createTaskIntoDB,
  getAllTasksFromDB,
  getSingleTaskFromDB,
  updateTaskIntoDB,
  deleteTaskFromDB,
};
