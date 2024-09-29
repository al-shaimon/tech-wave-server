"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// cast error handle
const handleCastError = (err) => {
    const errorMessages = [
        {
            path: '',
            message: err.message,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: errorMessages[0].message,
        errorMessages: errorMessages,
    };
};
exports.default = handleCastError;
