import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';
import config from '../../config';
import { IUser } from './user.interface';
import { PROVIDER, ROLE } from './user.constant';

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: false,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    image: {
      type: String,
      default: null,
    },
    isSocialLogin: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: Object.values(PROVIDER),
      default: null,
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER,
    },
    credits: {
      type: Number,
      default: 5,
      min: 0,
    },
    lastActiveAt: {
      type: Date,
      required: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// For generating access token
userSchema.methods.generateAccessToken = function () {
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
userSchema.methods.generateRefreshToken = function () {
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

const User = mongoose.model<IUser>('User', userSchema);

export default User;
