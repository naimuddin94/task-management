"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const utils_1 = require("../utils");
const verifyToken = async (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        return decoded;
    }
    catch {
        throw new utils_1.AppError(http_status_1.default.UNAUTHORIZED, 'Unauthorized access!');
    }
};
exports.default = verifyToken;
