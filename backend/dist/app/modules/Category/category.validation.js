"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
const createSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "Category name is required",
        })
            .min(2, { message: "Category name must be at least 2 characters long" })
            .max(30, { message: "Category name must not exceed 30 characters" }),
        color: zod_1.z
            .string()
            .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, {
            message: "Color must be a valid hex code (e.g., #fff or #ffffff)",
        })
            .optional(),
    }),
});
const updateSchema = zod_1.z.object({
    body: zod_1.z.object(createSchema.shape.body.shape).partial().strict(),
});
exports.CategoryValidation = {
    createSchema,
    updateSchema,
};
