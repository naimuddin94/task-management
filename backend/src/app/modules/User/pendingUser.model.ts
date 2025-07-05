import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { IPendingUser } from "./user.interface";
import config from "../../config";
import bcrypt from "bcryptjs";
import { OTP_REASON } from "./user.constant";

const pendingUserSchema = new mongoose.Schema<IPendingUser>(
  {
    fullName: {
      type: String,
      required: [true, "Please provide a full name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
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

const PendingUser = mongoose.model<IPendingUser>(
  "PendingUser",
  pendingUserSchema
);

export default PendingUser;
