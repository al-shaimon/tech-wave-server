"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// validation error handle
const handleValidationError = (err) => {
    const errorMessages = Object.values(err.errors).map((val) => {
        return {
            path: '',
            message: val === null || val === void 0 ? void 0 : val.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: errorMessages[0].message,
        errorMessages: errorMessages,
    };
};
exports.default = handleValidationError;
