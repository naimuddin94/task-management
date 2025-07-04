import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { IPendingUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcryptjs';
import { OTP_REASON } from './user.constant';

const pendingUserSchema = new mongoose.Schema<IPendingUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide a full name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    otp: {
      type: String,
      required: false,
    },
    otpExpiry: {
      type: Date,
      required: false,
    },
    reason: {
      type: String,
      default: OTP_REASON.SIGNUP,
    },
  },
  { timestamps: { createdAt: true } }
);

// For generating access token
pendingUserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
    },
    config.jwt_access_secret!,
    {
      expiresIn: config.jwt_access_expires_in as any,
    }
  );
};

// For generating refresh token
pendingUserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    config.jwt_refresh_secret!,
    {
      expiresIn: config.jwt_refresh_expires_in as any,
    }
  );
};

const PendingUser = mongoose.model<IPendingUser>(
  'PendingUser',
  pendingUserSchema
);

export default PendingUser;
