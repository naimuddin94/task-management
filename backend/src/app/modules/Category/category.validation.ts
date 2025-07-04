import { z } from "zod";

const createSchema = z.object({
  body: z.object({
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
  }),
});

const updateSchema = z.object({
  body: z.object(createSchema.shape.body.shape).partial().strict(),
});

export const CategoryValidation = {
  createSchema,
  updateSchema,
};

export type TCategoryPayload = z.infer<typeof createSchema.shape.body>;
