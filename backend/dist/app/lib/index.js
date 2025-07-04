"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.generateOtp = exports.verifyToken = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const verifyToken_1 = __importDefault(require("./verifyToken"));
exports.verifyToken = verifyToken_1.default;
const generateOtp_1 = __importDefault(require("./generateOtp"));
exports.generateOtp = generateOtp_1.default;
const upload_1 = __importDefault(require("./upload"));
exports.upload = upload_1.default;
