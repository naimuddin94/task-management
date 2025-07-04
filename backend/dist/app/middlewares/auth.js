"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const utils_1 = require("../utils");
const user_model_1 = __importDefault(require("../modules/User/user.model"));
const auth = (...requiredRoles) => {
    return (0, utils_1.asyncHandler)(async (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '') ||
            req.cookies?.accessToken;
        // checking if the token is missing
        if (!token) {
            throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
        }
        // checking if the given token is valid
        let decoded;
        // Check if token is valid and not expired
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, 'Token has expired');
            }
            else {
                throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, 'Invalid token');
            }
        }
        const { id } = decoded;
        // checking if the user is exist
        const user = await user_model_1.default.findById(id);
        if (!user) {
            throw new utils_1.AppError(http_status_1.default.NOT_FOUND, 'User not exists!');
        }
        if (requiredRoles.length && !requiredRoles.includes(user.role)) {
            throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, 'You have no access to this route');
        }
        req.user = user;
        next();
    });
};
exports.default = auth;
