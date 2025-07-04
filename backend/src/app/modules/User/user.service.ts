import status from 'http-status';
import { AppError, Logger, sendOtpEmail } from '../../utils';
import User from './user.model';
import {
  TChangePasswordPayload,
  TOtpPayload,
  TSigninPayload,
  TSignupPayload,
  TUpdatePayload,
} from './user.validation';
import { generateOtp, verifyToken } from '../../lib';
import PendingUser from './pendingUser.model';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './user.interface';
import { TSocialLoginPayload } from '../../types';
import fs from 'fs';
import { OTP_REASON } from './user.constant';
import config from '../../config';
import jwt from 'jsonwebtoken';
import History from '../History/history.model';

const savePendingUserIntoDB = async (payload: TSignupPayload) => {
  const { email, password, fullName } = payload;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError(status.BAD_REQUEST, 'Email already exists');
  }

  const otp = generateOtp();
  await sendOtpEmail(email, otp, fullName);

  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds)
  );

  await PendingUser.findOneAndUpdate(
    { email },
    { fullName, email, password: hashPassword, otp, otpExpiry },
    { upsert: true, runValidators: true }
  );

  return { email: payload.email };
};

const verifyOtpAndSaveUserIntoDB = async (payload: TOtpPayload) => {
  const pendingUser = await PendingUser.findOne({ email: payload.email });

  if (!pendingUser) {
    throw new AppError(status.NOT_FOUND, 'User not exists!');
  }

  if (!pendingUser?.otpExpiry) {
    throw new AppError(status.BAD_REQUEST, 'Otp does not exists in DB');
  }

  if (pendingUser?.otp != payload.otp) {
    throw new AppError(status.BAD_REQUEST, 'Invalid otp!');
  }

  if (Date.now() > new Date(pendingUser.otpExpiry).getTime()) {
    throw new AppError(
      status.BAD_REQUEST,
      'OTP has expired. Please request a new one.'
    );
  }

  const accessToken = pendingUser.generateAccessToken();
  const refreshToken = pendingUser.generateRefreshToken();

  const { fullName, email, password } = pendingUser;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const [user] = await User.create([{ fullName, email, password }], {
      session,
    });
    await PendingUser.findOneAndDelete({ email }, { session });

    await session.commitTransaction();

    return {
      accessToken,
      refreshToken,
      fullName,
      email,
      _id: user._id,
      role: user.role,
    };
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      error?.message || 'Something went wrong creating new account'
    );
  } finally {
    await session.endSession();
  }
};

const resendOtpAgain = async (email: string) => {
  const user = await PendingUser.findOne({ email });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'Account not exists!');
  }

  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await sendOtpEmail(email, otp, user.fullName);

  const data = await PendingUser.findByIdAndUpdate(user._id, {
    $set: { otp, otpExpiry },
  });

  if (!data) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Something went wrong save new otp into db'
    );
  }

  return null;
};

const signinIntoDB = async (payload: TSigninPayload) => {
  const { email, password } = payload;
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists!');
  }

  if (user.isSocialLogin || !user?.password) {
    throw new AppError(
      status.BAD_REQUEST,
      'This account is registered via social login. Please sign in using your social account.'
    );
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid credentials');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  user.lastActiveAt = new Date();
  await user.save();

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    accessToken,
    refreshToken,
  };
};

// Social signin service
const socialLoginServices = async (payload: TSocialLoginPayload) => {
  const { email, fcmToken, image, name, address } = payload;

  // Check if user exists
  const auth = await User.findOne({ email });

  if (!auth) {
    const authRes = await User.create({
      email,
      fcmToken,
      image,
      name: name,
      address,
      isSocialLogin: true,
      isVerified: true,
    });

    if (!authRes) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        'Fail to create user into database'
      );
    }

    const accessToken = authRes.generateAccessToken();
    const refreshToken = authRes.generateRefreshToken();

    await User.findByIdAndUpdate(authRes._id, { refreshToken });

    return {
      fullName: authRes.fullName,
      email: authRes.email,
      role: authRes.role,
      image: authRes.image,
      accessToken,
      refreshToken,
    };
  } else {
    const accessToken = auth.generateAccessToken();
    const refreshToken = auth.generateRefreshToken();

    auth.refreshToken = refreshToken;
    await auth.save({ validateBeforeSave: false });

    return {
      fullName: auth.fullName,
      email: auth.email,
      role: auth.role,
      image: auth.image,
      accessToken,
      refreshToken,
    };
  }
};

const signoutFromDB = async (user: IUser) => {
  await User.findByIdAndUpdate(user._id, { $set: { refreshToken: null } });
  return null;
};

const updateProfileIntoDB = async (
  user: IUser,
  payload: TUpdatePayload & { image: string },
  file: Express.Multer.File | undefined
) => {
  const oldImagePath = user.image;
  const newImagePath = file?.path;

  const auth = await User.findOne({
    _id: user._id,
    isVerified: true,
  });

  if (!auth) {
    if (newImagePath) await safeUnlink(newImagePath);
    throw new AppError(status.NOT_FOUND, 'User not exists!');
  }

  if (newImagePath) {
    payload.image = newImagePath;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(user._id, payload, {
      new: true,
    }).select('-password');

    if (newImagePath && oldImagePath) {
      await safeUnlink(oldImagePath); // cleanup old image after successful update
    }

    return updatedUser;
  } catch (error) {
    if (newImagePath) await safeUnlink(newImagePath); // rollback new upload
    Logger.error('Error updating profile:', error);
    throw error;
  }
};

const safeUnlink = async (filePath: string) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    Logger.error(`Failed to delete file ${filePath}:`, error);
  }
};

const changePasswordIntoDB = async (
  requestedUser: IUser,
  payload: TChangePasswordPayload
) => {
  const user = await User.findOne({
    _id: requestedUser._id,
  }).select('+password');

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists!');
  }

  if (user.isSocialLogin || !user?.password) {
    throw new AppError(
      status.BAD_REQUEST,
      'This account is registered via social login. You can not change your password.'
    );
  }

  const isCredentialsCorrect = await bcrypt.compare(
    payload.oldPassword,
    user.password
  );

  if (!isCredentialsCorrect) {
    throw new AppError(status.UNAUTHORIZED, 'Current password is not correct');
  }

  const hashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  user.password = hashPassword;
  await user.save();

  return null;
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists!');
  }

  const otp = generateOtp();
  await sendOtpEmail(email, otp, user.fullName || 'Guest');

  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const { fullName, password } = user;

  await PendingUser.findOneAndUpdate(
    { email },
    {
      email,
      fullName,
      password,
      otp,
      otpExpiry,
      reason: OTP_REASON.FORGOT_PASSWORD,
    },
    { upsert: true, runValidators: true }
  );

  return { email };
};

const verifyOtpForForgetPassword = async (payload: {
  email: string;
  otp: string;
}) => {
  const user = await PendingUser.findOne({
    email: payload.email,
    reason: OTP_REASON.FORGOT_PASSWORD,
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists!');
  }

  // Check if the OTP matches
  if (user?.otp !== payload.otp || !user.otpExpiry) {
    throw new AppError(status.BAD_REQUEST, 'Invalid OTP');
  }

  // Check if OTP has expired
  if (Date.now() > new Date(user.otpExpiry).getTime()) {
    throw new AppError(status.BAD_REQUEST, 'OTP has expired');
  }

  const resetToken = jwt.sign(
    {
      email: user.email,
      isResetPassword: true,
    },
    config.jwt_access_secret!,
    {
      expiresIn: '1d',
    }
  );

  return { resetToken };
};

const resetPasswordIntoDB = async (resetToken: string, newPassword: string) => {
  const { email, isResetPassword } = (await verifyToken(resetToken)) as any;

  const pendingUser = await PendingUser.findOne({
    email,
    reason: OTP_REASON.FORGOT_PASSWORD,
  });

  if (!pendingUser) {
    throw new AppError(status.NOT_FOUND, 'User not exists!');
  }

  if (!isResetPassword) {
    throw new AppError(status.BAD_REQUEST, 'Invalid reset password token.');
  }

  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedUser = await User.findOne({ email }).session(session);

    if (!updatedUser) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        'Something went wrong while updating password'
      );
    }

    updatedUser.password = hashPassword;
    const accessToken = updatedUser.generateAccessToken();
    const refreshToken = updatedUser.generateRefreshToken();

    updatedUser.refreshToken = refreshToken;
    updatedUser.lastActiveAt = new Date();
    await updatedUser.save({ session });

    await PendingUser.findOneAndDelete(
      {
        email,
        reason: OTP_REASON.FORGOT_PASSWORD,
      },
      { session }
    );

    await session.commitTransaction();

    return {
      _id: updatedUser._id,
      name: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      error?.message || 'Something went wrong updating new password'
    );
  } finally {
    await session.endSession();
  }
};

const refreshTokenFromDB = async (user: IUser, userRefreshToken: string) => {
  if (user?.refreshToken !== userRefreshToken) {
    throw new AppError(status.FORBIDDEN, 'Forbidden access!');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    accessToken,
    refreshToken,
  };
};

const getProfileFromDB = async (user: IUser) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const stats = await History.aggregate([
    {
      $match: {
        user: user._id,
      },
    },
    {
      $facet: {
        overall: [
          {
            $group: {
              _id: null,
              totalSavedTime: { $sum: '$savedTime' },
              totalReduction: { $avg: '$reduction' },
              totalWordProcess: { $sum: '$totalWord' },
              totalSummaryWord: { $sum: '$summaryWord' },
              totalSummary: { $sum: 1 },
            },
          },
        ],
        lastWeek: [
          {
            $match: {
              createdAt: { $gte: oneWeekAgo },
            },
          },
          {
            $count: 'lastWeekSummary',
          },
        ],
      },
    },
    {
      $project: {
        totalSavedTime: {
          $ifNull: [{ $arrayElemAt: ['$overall.totalSavedTime', 0] }, 0],
        },
        totalReduction: {
          $ifNull: [{ $arrayElemAt: ['$overall.totalReduction', 0] }, 0],
        },
        totalWordProcess: {
          $ifNull: [{ $arrayElemAt: ['$overall.totalWordProcess', 0] }, 0],
        },
        totalSummaryWord: {
          $ifNull: [{ $arrayElemAt: ['$overall.totalSummaryWord', 0] }, 0],
        },
        totalSummary: {
          $ifNull: [{ $arrayElemAt: ['$overall.totalSummary', 0] }, 0],
        },
        lastWeekSummary: {
          $ifNull: [{ $arrayElemAt: ['$lastWeek.lastWeekSummary', 0] }, 0],
        },
      },
    },
  ]);

  return { ...user.toObject(), stats: stats[0] };
};

export const UserService = {
  savePendingUserIntoDB,
  verifyOtpAndSaveUserIntoDB,
  resendOtpAgain,
  signinIntoDB,
  socialLoginServices,
  signoutFromDB,
  updateProfileIntoDB,
  changePasswordIntoDB,
  forgotPassword,
  verifyOtpForForgetPassword,
  resetPasswordIntoDB,
  refreshTokenFromDB,
  getProfileFromDB,
};
