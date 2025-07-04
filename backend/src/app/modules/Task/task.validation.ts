import { z } from "zod";
import { PRIORITIES, TPriority } from "./task.constant";

const priorityEnum = z.enum(PRIORITIES);

const createSchema = z.object({
  body: z.object({
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
      .datetime({ message: "Due date must be a valid ISO datetime string" })
      .nullable()
      .optional(),

    priority: z
      .string()
      .optional()
      .refine((val) => !val || PRIORITIES.includes(val as TPriority), {
        message: `Priority must be one of: ${PRIORITIES.join(", ")}`,
      })
      .default("Medium"),

    categoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID")
      .nullable()
      .optional(),
  }),
});

const updateSchema = z.object({
  body: z.object(createSchema.shape.body.shape).partial().strict(),
});

export const TaskValidation = {
  createSchema,
  updateSchema,
};

export type TTaskPayload = z.infer<typeof createSchema.shape.body>;
