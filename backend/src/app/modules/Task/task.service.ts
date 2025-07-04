import QueryBuilder from "mongoose-query-builders";
import { IUser } from "./../User/user.interface";
import status from "http-status";
import { AppError } from "../../utils";
import Task from "./task.model";
import { TTaskPayload } from "./task.validation";
import { FilterQuery, Types } from "mongoose";
import Category from "../Category/category.model";
import { ITask } from "./task.interface";
import { ROLE } from "../User/user.constant";

// Create a new task
const createTaskIntoDB = async (
  user: IUser,
  payload: TTaskPayload & { user: string }
) => {
  const existing = await Task.findOne({ title: payload.title, user: user._id });
  if (existing) {
    throw new AppError(status.CONFLICT, "Task with this title already exists");
  }

  if (payload.categoryId) {
    const category = await Category.findById(payload.categoryId);

    if (!category) {
      throw new AppError(status.NOT_FOUND, "Category not found");
    }
  }

  payload.user = user._id as string;

  return await Task.create(payload);
};

// Get all tasks
const getAllTasksFromDB = async (
  user: IUser,
  query: Record<string, unknown>
) => {
  const filterQuery: FilterQuery<ITask> = {};

  if (user?.role != ROLE.ADMIN) {
    filterQuery.user = user._id;
  }

  const taskQuery = new QueryBuilder(
    Task.find(filterQuery).populate("category"),
    query
  )
    .search(["title", "priority", "description"])
    .filter()
    .sort()
    .fields()
    .paginate();

  const data = await taskQuery.modelQuery;
  const meta = await taskQuery.countTotal();

  return { data, meta };
};

// Get single task by ID
const getSingleTaskFromDB = async (user: IUser, id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid task ID");
  }

  const filterQuery: FilterQuery<ITask> = {};

  if (user?.role != ROLE.ADMIN) {
    filterQuery.user = user._id;
  }

  const task = await Task.findOne(filterQuery).populate("category");

  if (!task) {
    throw new AppError(status.NOT_FOUND, "Task not found");
  }

  return task;
};

// Update task by ID
const updateTaskIntoDB = async (
  user: IUser,
  id: string,
  payload: Partial<TTaskPayload>
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid task ID");
  }

  const filterQuery: FilterQuery<ITask> = { _id: id };

  if (user?.role != ROLE.ADMIN) {
    filterQuery.user = user._id;
  }

  const task = await Task.findByIdAndUpdate(filterQuery, payload, {
    new: true,
    runValidators: true,
  }).populate("category");

  if (!task) {
    throw new AppError(status.NOT_FOUND, "Task not found");
  }

  return task;
};

// Delete task by ID
const deleteTaskFromDB = async (user: IUser, id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid task ID");
  }

  const filterQuery: FilterQuery<ITask> = { _id: id };

  if (user?.role != ROLE.ADMIN) {
    filterQuery.user = user._id;
  }

  const task = await Task.findOneAndDelete(filterQuery);

  if (!task) {
    throw new AppError(status.NOT_FOUND, "Task not found");
  }

  return null;
};

export const TaskService = {
  createTaskIntoDB,
  getAllTasksFromDB,
  getSingleTaskFromDB,
  updateTaskIntoDB,
  deleteTaskFromDB,
};
