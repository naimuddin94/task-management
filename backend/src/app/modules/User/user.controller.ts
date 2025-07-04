import status from 'http-status';
import { AppResponse, asyncHandler, options } from '../../utils';
import { UserService } from './user.service';
import { CookieOptions } from 'express';

const signup = asyncHandler(async (req, res) => {
  const result = await UserService.savePendingUserIntoDB(req.body);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'OTP send successfully'));
});

const signupVerification = asyncHandler(async (req, res) => {
  const result = await UserService.verifyOtpAndSaveUserIntoDB(req.body);

  res
    .status(status.CREATED)
    .cookie('accessToken', result.accessToken, options as CookieOptions)
    .cookie('refreshToken', result.refreshToken, options as CookieOptions)
    .json(
      new AppResponse(status.CREATED, result, 'Account created successfully')
    );
});

const resentOtp = asyncHandler(async (req, res) => {
  const result = await UserService.resendOtpAgain(req.body.email);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Resend otp send successfully'));
});

const signin = asyncHandler(async (req, res) => {
  const result = await UserService.signinIntoDB(req.body);

  res
    .status(status.OK)
    .cookie('accessToken', result.accessToken, options as CookieOptions)
    .cookie('refreshToken', result.refreshToken, options as CookieOptions)
    .json(new AppResponse(status.OK, result, 'Signin successfully'));
});

const socialSignin = asyncHandler(async (req, res) => {
  const result = await UserService.socialLoginServices(req.body);

  res
    .status(status.OK)
    .cookie('accessToken', result.accessToken, options as CookieOptions)
    .cookie('refreshToken', result.refreshToken, options as CookieOptions)
    .json(new AppResponse(status.OK, result, 'Signin successfully'));
});

const signout = asyncHandler(async (req, res) => {
  await UserService.signoutFromDB(req.user);

  res
    .status(status.OK)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(new AppResponse(status.OK, null, 'Signout successfully'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const result = await UserService.updateProfileIntoDB(
    req.user,
    req.body,
    req.file
  );

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Profile update successfully'));
});

const changePassword = asyncHandler(async (req, res) => {
  const result = await UserService.changePasswordIntoDB(req.user, req.body);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Password change successfully'));
});

// For forget password
const forgetPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const result = await UserService.forgotPassword(email);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result,
        'Your OTP has been successfully sent to your email.'
      )
    );
});

const verifyOtpForForgetPassword = asyncHandler(async (req, res) => {
  const result = await UserService.verifyOtpForForgetPassword(req.body);

  res
    .status(status.OK)
    .cookie('resetPasswordToken', result.resetToken, options as CookieOptions)
    .json(new AppResponse(status.OK, result, 'OTP verified successfully'));
});

const resetPassword = asyncHandler(async (req, res) => {
  const resetToken =
    req.header('Authorization')?.replace('Bearer ', '') ||
    req.cookies?.resetPasswordToken;
  const result = await UserService.resetPasswordIntoDB(
    resetToken,
    req.body.newPassword
  );

  res
    .status(status.OK)
    .cookie('accessToken', result.accessToken, options as CookieOptions)
    .cookie('refreshToken', result.refreshToken, options as CookieOptions)
    .json(new AppResponse(status.OK, result, 'Reset password successfully'));
});

const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const result = await UserService.refreshTokenFromDB(req.user, refreshToken);

  res
    .status(status.OK)
    .cookie('accessToken', result.accessToken, options as CookieOptions)
    .cookie('refreshToken', result.refreshToken, options as CookieOptions)
    .json(
      new AppResponse(status.OK, result, 'Refresh access token successfully')
    );
});

const getProfile = asyncHandler(async (req, res) => {
  const result = await UserService.getProfileFromDB(req.user);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Profile retrieved successfully'));
});

export const UserController = {
  signup,
  signupVerification,
  resentOtp,
  signin,
  socialSignin,
  signout,
  updateProfile,
  changePassword,
  forgetPassword,
  verifyOtpForForgetPassword,
  resetPassword,
  refreshToken,
  getProfile,
};
