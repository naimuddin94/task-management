"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppResponse {
    constructor(statusCode, data, message, meta = null) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.meta = meta;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        if (meta) {
            this.meta = meta;
        }
    }
}
exports.default = AppResponse;
