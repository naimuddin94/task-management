import { z } from 'zod';
import { PROVIDER } from './user.constant';

// Reusable password schema with detailed validation
const passwordSchema = z
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

const createSchema = z.object({
  body: z.object({
    fullName: z
      .string({
        required_error: 'Name is required',
      })
      .min(3, { message: 'Name must be at least 3 characters long' })
      .max(30, { message: 'Name cannot exceed 30 characters' })
      .regex(/^[a-zA-Z\s]+$/, {
        message: 'Name can only contain letters and spaces',
      }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),
    password: passwordSchema,
  }),
});

const verifyOtpSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),
    otp: z
      .string({
        required_error: 'OTP is required',
      })
      .regex(/^\d+$/, { message: 'OTP must be a number' })
      .length(6, { message: 'OTP must be exactly 6 digits' }),
  }),
});

const emailSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),
  }),
});

const socialSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    fcmToken: z.string().nonempty('FCM Token is required'),
    provider: z.enum([PROVIDER.GOOGLE, PROVIDER.FACEBOOK, PROVIDER.APPLE], {
      message: 'Provider must be one of: GOOGLE, FACEBOOK, or APPLE.',
    }),

    image: z.string().url('Image URL must be a valid URL').optional(),
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
  }),
});

const updateSchema = z.object({
  body: z
    .object(createSchema.shape.body.shape)
    .omit({ email: true, password: true })
    .partial()
    .extend({
      description: z.string().optional(),
      address: z.string().optional(),
    })
    .strict(),
});

const forgetPasswordVerifySchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),
    otp: z
      .string({
        required_error: 'OTP is required',
      })
      .regex(/^\d+$/, { message: 'OTP must be a number' })
      .length(6, { message: 'OTP must be exactly 6 digits' }),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    newPassword: passwordSchema,
  }),
});

const signinSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),
    password: passwordSchema,
  }),
});

const passwordChangeSchema = z.object({
  body: z.object({
    oldPassword: passwordSchema,

    newPassword: passwordSchema,
  }),
});

const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const accessTokenSchema = z.object({
  cookies: z.object({
    accessToken: z.string({
      required_error: 'Access token is required!',
    }),
  }),
});

export const UserValidation = {
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

export type TSignupPayload = z.infer<typeof createSchema.shape.body>;
export type TSigninPayload = z.infer<typeof signinSchema.shape.body>;
export type TOtpPayload = z.infer<typeof verifyOtpSchema.shape.body>;
export type TUpdatePayload = z.infer<typeof updateSchema.shape.body>;
export type TChangePasswordPayload = z.infer<
  typeof passwordChangeSchema.shape.body
>;
