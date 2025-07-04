"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestFromFormData = exports.validateRequestCookies = exports.validateRequest = void 0;
const utils_1 = require("../utils");
const validateRequest = (schema) => {
    return (0, utils_1.asyncHandler)(async (req, res, next) => {
        await schema.parseAsync({
            body: req.body,
            cookies: req.cookies,
        });
        next();
    });
};
exports.validateRequest = validateRequest;
const validateRequestCookies = (schema) => {
    return (0, utils_1.asyncHandler)(async (req, res, next) => {
        const parsedCookies = await schema.parseAsync({
            cookies: req.cookies,
        });
        req.cookies = parsedCookies.cookies;
        next();
    });
};
exports.validateRequestCookies = validateRequestCookies;
const validateRequestFromFormData = (schema) => {
    return (0, utils_1.asyncHandler)(async (req, res, next) => {
        if (req?.body?.data) {
            await schema.parseAsync({
                body: JSON.parse(req.body.data),
                cookies: req.cookies,
            });
            req.body = JSON.parse(req.body.data);
            next();
        }
    });
};
exports.validateRequestFromFormData = validateRequestFromFormData;
