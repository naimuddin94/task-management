import { z } from "zod";

const passwordSchema = z
  .string({
    required_error: "Password is required",
  })
  .min(6, {
    message: "Password must be at least 6 characters long",
  })
  .max(20, {
    message: "Password cannot exceed 20 characters",
  })
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must include at least one lowercase letter",
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must include at least one uppercase letter",
  })
  .refine((val) => /\d/.test(val), {
    message: "Password must include at least one number",
  })
  .refine((val) => /[@$!%*?&#]/.test(val), {
    message: "Password must include at least one special character (@$!%*?&#)",
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    role: z.enum(["user", "editor", "reviewer"], {
      required_error: "Please select a role",
    }),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must agree to the terms and conditions"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
