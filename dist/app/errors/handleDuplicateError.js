"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// duplicate error handle
const handleDuplicateError = (err) => {
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
exports.default = handleDuplicateError;
