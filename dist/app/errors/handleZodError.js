"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// zod error handle
const handleZodError = (err) => {
    const errorMessages = err.issues.map((issue) => {
        return {
            path: issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1],
            message: issue.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation Error',
        errorMessages: errorMessages,
    };
};
exports.default = handleZodError;
