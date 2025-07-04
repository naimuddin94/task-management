import { Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  color: string | null;
}
