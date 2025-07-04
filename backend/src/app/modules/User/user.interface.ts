import { Document, Types } from 'mongoose';
import { TOtpReason, TProvider, TRole } from './user.constant';

export interface IPendingUser extends Document {
  fullName: string;
  email: string;
  password: string;
  otp: string | null;
  otpExpiry: Date | null;
  reason: TOtpReason;
  createdAt: Date;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string | null;
  image: string | null;
  isSocialLogin: boolean;
  provider: TProvider | null;
  role: TRole;
  credits: number;
  lastActiveAt: Date;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}
