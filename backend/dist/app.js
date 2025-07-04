"use strict";
/*
 * Title: Task Management
 * Description: A Backend Application for Task Management on Express
 * Author: Md Naim Uddin
 * Github: naimuddin94
 * Date: 04/07/2025
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./app/routes"));
const utils_1 = require("./app/utils");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: ['http://localhost:3000'],
}));
app.use((0, cookie_parser_1.default)());
// static files
app.use('/public', express_1.default.static('public'));
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', routes_1.default);
//Testing
app.get('/', (req, res, next) => {
    res.send({ message: 'Express server is running :(' });
});
//global error handler
app.use(utils_1.globalErrorHandler);
//handle not found
app.use(utils_1.notFound);
exports.default = app;
