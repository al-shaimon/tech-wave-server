"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNoDataFoundResponse = void 0;
const sendNoDataFoundResponse = (res) => {
    return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'No Data Found',
        data: [],
    });
};
exports.sendNoDataFoundResponse = sendNoDataFoundResponse;
