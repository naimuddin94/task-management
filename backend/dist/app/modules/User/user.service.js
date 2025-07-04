"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../../utils");
const user_model_1 = __importDefault(require("./user.model"));
const lib_1 = require("../../lib");
const pendingUser_model_1 = __importDefault(require("./pendingUser.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fs_1 = __importDefault(require("fs"));
const user_constant_1 = require("./user.constant");
const config_1 = __importDefault(require("../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const savePendingUserIntoDB = async (payload) => {
    const { email, password, fullName } = payload;
    const existingUser = await user_model_1.default.findOne({ email });
    if (existingUser) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "Email already exists");
    }
    const otp = (0, lib_1.generateOtp)();
    await (0, utils_1.sendOtpEmail)(email, otp, fullName);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const hashPassword = await bcryptjs_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    await pendingUser_model_1.default.findOneAndUpdate({ email }, { fullName, email, password: hashPassword, otp, otpExpiry }, { upsert: true, runValidators: true });
    return { email: payload.email };
};
const verifyOtpAndSaveUserIntoDB = async (payload) => {
    const pendingUser = await pendingUser_model_1.default.findOne({ email: payload.email });
    if (!pendingUser) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "User not exists!");
    }
    if (!pendingUser?.otpExpiry) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "Otp does not exists in DB");
    }
    if (pendingUser?.otp != payload.otp) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid otp!");
    }
    if (Date.now() > new Date(pendingUser.otpExpiry).getTime()) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "OTP has expired. Please request a new one.");
    }
    const accessToken = pendingUser.generateAccessToken();
    const refreshToken = pendingUser.generateRefreshToken();
    const { fullName, email, password } = pendingUser;
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const [user] = await user_model_1.default.create([{ fullName, email, password }], {
            session,
        });
        await pendingUser_model_1.default.findOneAndDelete({ email }, { session });
        await session.commitTransaction();
        return {
            accessToken,
            refreshToken,
            fullName,
            email,
            _id: user._id,
            role: user.role,
        };
    }
    catch (error) {
        await session.abortTransaction();
        throw new utils_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, error?.message || "Something went wrong creating new account");
    }
    finally {
        await session.endSession();
    }
};
const resendOtpAgain = async (email) => {
    const user = await pendingUser_model_1.default.findOne({ email });
    if (!user) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "Account not exists!");
    }
    const otp = (0, lib_1.generateOtp)();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await (0, utils_1.sendOtpEmail)(email, otp, user.fullName);
    const data = await pendingUser_model_1.default.findByIdAndUpdate(user._id, {
        $set: { otp, otpExpiry },
    });
    if (!data) {
        throw new utils_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Something went wrong save new otp into db");
    }
    return null;
};
const signinIntoDB = async (payload) => {
    const { email, password } = payload;
    const user = await user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "User not exists!");
    }
    if (user.isSocialLogin || !user?.password) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "This account is registered via social login. Please sign in using your social account.");
    }
    const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, "Invalid credentials");
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
const socialLoginServices = async (payload) => {
    const { email, fcmToken, image, name, address } = payload;
    // Check if user exists
    const auth = await user_model_1.default.findOne({ email });
    if (!auth) {
        const authRes = await user_model_1.default.create({
            email,
            fcmToken,
            image,
            name: name,
            address,
            isSocialLogin: true,
            isVerified: true,
        });
        if (!authRes) {
            throw new utils_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Fail to create user into database");
        }
        const accessToken = authRes.generateAccessToken();
        const refreshToken = authRes.generateRefreshToken();
        await user_model_1.default.findByIdAndUpdate(authRes._id, { refreshToken });
        return {
            fullName: authRes.fullName,
            email: authRes.email,
            role: authRes.role,
            image: authRes.image,
            accessToken,
            refreshToken,
        };
    }
    else {
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
const signoutFromDB = async (user) => {
    await user_model_1.default.findByIdAndUpdate(user._id, { $set: { refreshToken: null } });
    return null;
};
const updateProfileIntoDB = async (user, payload, file) => {
    const oldImagePath = user.image;
    const newImagePath = file?.path;
    const auth = await user_model_1.default.findOne({
        _id: user._id,
        isVerified: true,
    });
    if (!auth) {
        if (newImagePath)
            await safeUnlink(newImagePath);
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "User not exists!");
    }
    if (newImagePath) {
        payload.image = newImagePath;
    }
    try {
        const updatedUser = await user_model_1.default.findByIdAndUpdate(user._id, payload, {
            new: true,
        }).select("-password");
        if (newImagePath && oldImagePath) {
            await safeUnlink(oldImagePath); // cleanup old image after successful update
        }
        return updatedUser;
    }
    catch (error) {
        if (newImagePath)
            await safeUnlink(newImagePath); // rollback new upload
        utils_1.Logger.error("Error updating profile:", error);
        throw error;
    }
};
const safeUnlink = async (filePath) => {
    try {
        await fs_1.default.promises.unlink(filePath);
    }
    catch (error) {
        utils_1.Logger.error(`Failed to delete file ${filePath}:`, error);
    }
};
const changePasswordIntoDB = async (requestedUser, payload) => {
    const user = await user_model_1.default.findOne({
        _id: requestedUser._id,
    }).select("+password");
    if (!user) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "User not exists!");
    }
    if (user.isSocialLogin || !user?.password) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "This account is registered via social login. You can not change your password.");
    }
    const isCredentialsCorrect = await bcryptjs_1.default.compare(payload.oldPassword, user.password);
    if (!isCredentialsCorrect) {
        throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, "Current password is not correct");
    }
    const hashPassword = await bcryptjs_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    user.password = hashPassword;
    await user.save();
    return null;
};
const forgotPassword = async (email) => {
    const user = await user_model_1.default.findOne({
        email,
    });
    if (!user) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "User not exists!");
    }
    const otp = (0, lib_1.generateOtp)();
    await (0, utils_1.sendOtpEmail)(email, otp, user.fullName || "Guest");
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const { fullName, password } = user;
    await pendingUser_model_1.default.findOneAndUpdate({ email }, {
        email,
        fullName,
        password,
        otp,
        otpExpiry,
        reason: user_constant_1.OTP_REASON.FORGOT_PASSWORD,
    }, { upsert: true, runValidators: true });
    return { email };
};
const verifyOtpForForgetPassword = async (payload) => {
    const user = await pendingUser_model_1.default.findOne({
        email: payload.email,
        reason: user_constant_1.OTP_REASON.FORGOT_PASSWORD,
    });
    if (!user) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "User not exists!");
    }
    // Check if the OTP matches
    if (user?.otp !== payload.otp || !user.otpExpiry) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid OTP");
    }
    // Check if OTP has expired
    if (Date.now() > new Date(user.otpExpiry).getTime()) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "OTP has expired");
    }
    const resetToken = jsonwebtoken_1.default.sign({
        email: user.email,
        isResetPassword: true,
    }, config_1.default.jwt_access_secret, {
        expiresIn: "1d",
    });
    return { resetToken };
};
const resetPasswordIntoDB = async (resetToken, newPassword) => {
    const { email, isResetPassword } = (await (0, lib_1.verifyToken)(resetToken));
    const pendingUser = await pendingUser_model_1.default.findOne({
        email,
        reason: user_constant_1.OTP_REASON.FORGOT_PASSWORD,
    });
    if (!pendingUser) {
        throw new utils_1.AppError(http_status_1.default.NOT_FOUND, "User not exists!");
    }
    if (!isResetPassword) {
        throw new utils_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid reset password token.");
    }
    const hashPassword = await bcryptjs_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const updatedUser = await user_model_1.default.findOne({ email }).session(session);
        if (!updatedUser) {
            throw new utils_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Something went wrong while updating password");
        }
        updatedUser.password = hashPassword;
        const accessToken = updatedUser.generateAccessToken();
        const refreshToken = updatedUser.generateRefreshToken();
        updatedUser.refreshToken = refreshToken;
        updatedUser.lastActiveAt = new Date();
        await updatedUser.save({ session });
        await pendingUser_model_1.default.findOneAndDelete({
            email,
            reason: user_constant_1.OTP_REASON.FORGOT_PASSWORD,
        }, { session });
        await session.commitTransaction();
        return {
            _id: updatedUser._id,
            name: updatedUser.fullName,
            email: updatedUser.email,
            role: updatedUser.role,
            accessToken,
            refreshToken,
        };
    }
    catch (error) {
        await session.abortTransaction();
        throw new utils_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, error?.message || "Something went wrong updating new password");
    }
    finally {
        await session.endSession();
    }
};
const refreshTokenFromDB = async (user, userRefreshToken) => {
    if (user?.refreshToken !== userRefreshToken) {
        throw new utils_1.AppError(http_status_1.default.FORBIDDEN, "Forbidden access!");
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
const getProfileFromDB = async (user) => {
    return user;
};
exports.UserService = {
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
