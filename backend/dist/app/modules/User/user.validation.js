"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
// Reusable password schema with detailed validation
const passwordSchema = zod_1.z
    .string({
    required_error: 'Password is required',
})
    .min(6, {
    message: 'Password must be at least 6 characters long',
})
    .max(20, {
    message: 'Password cannot exceed 20 characters',
})
    .refine((val) => /[a-z]/.test(val), {
    message: 'Password must include at least one lowercase letter',
})
    .refine((val) => /[A-Z]/.test(val), {
    message: 'Password must include at least one uppercase letter',
})
    .refine((val) => /\d/.test(val), {
    message: 'Password must include at least one number',
})
    .refine((val) => /[@$!%*?&#]/.test(val), {
    message: 'Password must include at least one special character (@$!%*?&#)',
});
const createSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z
            .string({
            required_error: 'Name is required',
        })
            .min(3, { message: 'Name must be at least 3 characters long' })
            .max(30, { message: 'Name cannot exceed 30 characters' })
            .regex(/^[a-zA-Z\s]+$/, {
            message: 'Name can only contain letters and spaces',
        }),
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email({ message: 'Invalid email format' }),
        password: passwordSchema,
    }),
});
const verifyOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email({ message: 'Invalid email format' }),
        otp: zod_1.z
            .string({
            required_error: 'OTP is required',
        })
            .regex(/^\d+$/, { message: 'OTP must be a number' })
            .length(6, { message: 'OTP must be exactly 6 digits' }),
    }),
});
const emailSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email({ message: 'Invalid email format' }),
    }),
});
const socialSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        fcmToken: zod_1.z.string().nonempty('FCM Token is required'),
        provider: zod_1.z.enum([user_constant_1.PROVIDER.GOOGLE, user_constant_1.PROVIDER.FACEBOOK, user_constant_1.PROVIDER.APPLE], {
            message: 'Provider must be one of: GOOGLE, FACEBOOK, or APPLE.',
        }),
        image: zod_1.z.string().url('Image URL must be a valid URL').optional(),
        name: zod_1.z.string().optional(),
        phoneNumber: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
    }),
});
const updateSchema = zod_1.z.object({
    body: zod_1.z
        .object(createSchema.shape.body.shape)
        .omit({ email: true, password: true })
        .partial()
        .extend({
        description: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
    })
        .strict(),
});
const forgetPasswordVerifySchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email({ message: 'Invalid email format' }),
        otp: zod_1.z
            .string({
            required_error: 'OTP is required',
        })
            .regex(/^\d+$/, { message: 'OTP must be a number' })
            .length(6, { message: 'OTP must be exactly 6 digits' }),
    }),
});
const resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        newPassword: passwordSchema,
    }),
});
const signinSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email({ message: 'Invalid email format' }),
        password: passwordSchema,
    }),
});
const passwordChangeSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: passwordSchema,
        newPassword: passwordSchema,
    }),
});
const refreshTokenSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh token is required!',
        }),
    }),
});
const accessTokenSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        accessToken: zod_1.z.string({
            required_error: 'Access token is required!',
        }),
    }),
});
exports.UserValidation = {
    createSchema,
    verifyOtpSchema,
    emailSchema,
    signinSchema,
    socialSchema,
    updateSchema,
    passwordChangeSchema,
    resetPasswordSchema,
    refreshTokenSchema,
    accessTokenSchema,
    forgetPasswordVerifySchema,
};
