import { Document, Types } from "mongoose";
import { TPriority } from "./task.constant";

export interface ITask extends Document {
  user: Types.ObjectId;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: Date | null;
  priority: TPriority;
  category: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}
