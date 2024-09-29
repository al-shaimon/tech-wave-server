"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const notFound_1 = __importDefault(require("./app/middleWares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middleWares/globalErrorHandler"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
//cors
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'https://tech-wave-client.vercel.app'],
    credentials: true,
}));
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/', routes_1.default);
//Testing
app.get('/', (req, res, next) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Welcome to the Lost And Found API',
    });
});
//global error handler
app.use(globalErrorHandler_1.default);
//handle not found
app.use(notFound_1.default);
exports.default = app;
