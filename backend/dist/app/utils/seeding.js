"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const user_constant_1 = require("../modules/User/user.constant");
const user_model_1 = __importDefault(require("../modules/User/user.model"));
const logger_1 = require("./logger");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedingAdmin = async () => {
    try {
        // at first check if the admin exist of not
        const admin = await user_model_1.default.findOne({
            role: user_constant_1.ROLE.ADMIN,
            email: config_1.default.super_admin.email,
        });
        if (!admin) {
            const hashPassword = await bcryptjs_1.default.hash(config_1.default.super_admin.password, Number(config_1.default.bcrypt_salt_rounds));
            await user_model_1.default.create({
                fullName: 'Admin',
                role: user_constant_1.ROLE.ADMIN,
                email: config_1.default.super_admin.email,
                password: hashPassword,
            });
        }
    }
    catch {
        logger_1.Logger.error('Error seeding admin');
    }
};
exports.default = seedingAdmin;
