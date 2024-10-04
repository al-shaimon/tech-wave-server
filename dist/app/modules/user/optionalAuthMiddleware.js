"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const optionalAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret || '');
            req.user = decoded;
        }
        catch (err) {
            // If token is invalid, we just continue without setting req.user
            console.log('Invalid token in optional auth');
        }
    }
    next();
};
exports.default = optionalAuthMiddleware;
