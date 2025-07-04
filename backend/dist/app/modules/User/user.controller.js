"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../../utils");
const user_service_1 = require("./user.service");
const signup = (0, utils_1.asyncHandler)(async (req, res) => {
    const result = await user_service_1.UserService.savePendingUserIntoDB(req.body);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'OTP send successfully'));
});
const signupVerification = (0, utils_1.asyncHandler)(async (req, res) => {
    const result = await user_service_1.UserService.verifyOtpAndSaveUserIntoDB(req.body);
    res
        .status(http_status_1.default.CREATED)
        .cookie('accessToken', result.accessToken, utils_1.options)
        .cookie('refreshToken', result.refreshToken, utils_1.options)
        .json(new utils_1.AppResponse(http_status_1.default.CREATED, result, 'Account created successfully'));
});
const resentOtp = (0, utils_1.asyncHandler)(async (req, res) => {
    const result = await user_service_1.UserService.resendOtpAgain(req.body.email);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'Resend otp send successfully'));
});
const signin = (0, utils_1.asyncHandler)(async (req, res) => {
    const result = await user_service_1.UserService.signinIntoDB(req.body);
    res
        .status(http_status_1.default.OK)
        .cookie('accessToken', result.accessToken, utils_1.options)
        .cookie('refreshToken', result.refreshToken, utils_1.options)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'Signin successfully'));
});
const socialSignin = (0, utils_1.asyncHandler)(async (req, res) => {
    const result = await user_service_1.UserService.socialLoginServices(req.body);
    res
        .status(http_status_1.default.OK)
        .cookie('accessToken', result.accessToken, utils_1.options)
        .cookie('refreshToken', result.refreshToken, utils_1.options)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'Signin successfully'));
});
const signout = (0, utils_1.asyncHandler)(async (req, res) => {
    await user_service_1.UserService.signoutFromDB(req.user);
    res
        .status(http_status_1.default.OK)
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .json(new utils_1.AppResponse(http_status_1.default.OK, null, 'Signout successfully'));
});
const updateProfile = (0, utils_1.asyncHandler)(async (req, res) => {
    const result = await user_service_1.UserService.updateProfileIntoDB(req.user, req.body, req.file);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'Profile update successfully'));
});
const changePassword = (0, utils_1.asyncHandler)(async (req, res) => {
    const result = await user_service_1.UserService.changePasswordIntoDB(req.user, req.body);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'Password change successfully'));
});
// For forget password
const forgetPassword = (0, utils_1.asyncHandler)(async (req, res) => {
    const email = req.body.email;
    const result = await user_service_1.UserService.forgotPassword(email);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'Your OTP has been successfully sent to your email.'));
});
const verifyOtpForForgetPassword = (0, utils_1.asyncHandler)(async (req, res) => {
    const result = await user_service_1.UserService.verifyOtpForForgetPassword(req.body);
    res
        .status(http_status_1.default.OK)
        .cookie('resetPasswordToken', result.resetToken, utils_1.options)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'OTP verified successfully'));
});
const resetPassword = (0, utils_1.asyncHandler)(async (req, res) => {
    const resetToken = req.header('Authorization')?.replace('Bearer ', '') ||
        req.cookies?.resetPasswordToken;
    const result = await user_service_1.UserService.resetPasswordIntoDB(resetToken, req.body.newPassword);
    res
        .status(http_status_1.default.OK)
        .cookie('accessToken', result.accessToken, utils_1.options)
        .cookie('refreshToken', result.refreshToken, utils_1.options)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'Reset password successfully'));
});
const refreshToken = (0, utils_1.asyncHandler)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    const result = await user_service_1.UserService.refreshTokenFromDB(req.user, refreshToken);
    res
        .status(http_status_1.default.OK)
        .cookie('accessToken', result.accessToken, utils_1.options)
        .cookie('refreshToken', result.refreshToken, utils_1.options)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'Refresh access token successfully'));
});
const getProfile = (0, utils_1.asyncHandler)(async (req, res) => {
    const result = await user_service_1.UserService.getProfileFromDB(req.user);
    res
        .status(http_status_1.default.OK)
        .json(new utils_1.AppResponse(http_status_1.default.OK, result, 'Profile retrieved successfully'));
});
exports.UserController = {
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
