import { PRIORITIES, TPriority } from "@/types";
import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string({
      required_error: "Category name is required",
    })
    .min(2, { message: "Category name must be at least 2 characters long" })
    .max(30, { message: "Category name must not exceed 30 characters" }),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, {
      message: "Color must be a valid hex code (e.g., #fff or #ffffff)",
    })
    .optional(),
});

export const taskSchema = z.object({
  title: z
    .string({
      required_error: "Task title is required",
    })
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must not exceed 100 characters" }),

  description: z
    .string()
    .max(1000, { message: "Description cannot exceed 1000 characters" })
    .nullable()
    .optional(),

  completed: z.boolean().optional(),

  dueDate: z
    .string()
    .datetime({ message: "Due date is required" })
    .nullable()
    .optional(),

  priority: z
    .string()
    .optional()
    .refine((val) => !val || PRIORITIES.includes(val as TPriority), {
      message: `Priority must be one of: ${PRIORITIES.join(", ")}`,
    })
    .default("Medium"),

  category: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID")
    .nullable()
    .optional(),
});

export type TCategoryPayload = z.infer<typeof categorySchema>;
export type TTaskPayload = z.infer<typeof taskSchema>;
