"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const user_constant_1 = require("./user.constant");
const pendingUserSchema = new mongoose_1.default.Schema({
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
        default: user_constant_1.OTP_REASON.SIGNUP,
    },
}, { timestamps: { createdAt: true } });
// For generating access token
pendingUserSchema.methods.generateAccessToken = function () {
    return jsonwebtoken_1.default.sign({
        id: this._id,
        fullName: this.fullName,
        email: this.email,
        role: this.role,
    }, config_1.default.jwt_access_secret, {
        expiresIn: config_1.default.jwt_access_expires_in,
    });
};
// For generating refresh token
pendingUserSchema.methods.generateRefreshToken = function () {
    return jsonwebtoken_1.default.sign({
        id: this._id,
    }, config_1.default.jwt_refresh_secret, {
        expiresIn: config_1.default.jwt_refresh_expires_in,
    });
};
const PendingUser = mongoose_1.default.model('PendingUser', pendingUserSchema);
exports.default = PendingUser;
