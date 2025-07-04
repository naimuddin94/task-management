export const ROLE = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  REVIEWER: 'reviewer',
  USER: 'user',
} as const;

export type TRole = (typeof ROLE)[keyof typeof ROLE];

export const PROVIDER = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  APPLE: 'apple',
} as const;

export type TProvider = (typeof PROVIDER)[keyof typeof PROVIDER];

export const OTP_REASON = {
  SIGNUP: 'signup',
  FORGOT_PASSWORD: 'forgot_password',
} as const;

export type TOtpReason = (typeof OTP_REASON)[keyof typeof OTP_REASON];
