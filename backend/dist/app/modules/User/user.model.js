"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const user_constant_1 = require("./user.constant");
const userSchema = new mongoose_1.default.Schema({
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
        enum: Object.values(user_constant_1.PROVIDER),
        default: null,
    },
    role: {
        type: String,
        enum: Object.values(user_constant_1.ROLE),
        default: user_constant_1.ROLE.USER,
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
}, { timestamps: true });
// For generating access token
userSchema.methods.generateAccessToken = function () {
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
userSchema.methods.generateRefreshToken = function () {
    return jsonwebtoken_1.default.sign({
        id: this._id,
    }, config_1.default.jwt_refresh_secret, {
        expiresIn: config_1.default.jwt_refresh_expires_in,
    });
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
