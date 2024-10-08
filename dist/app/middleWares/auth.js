"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const user_model_1 = require("../modules/User/user.model");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        // check if the token is sent from the client
        if (!token) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: 'You have no access to this route',
            });
        }
        // check if the given token is valid
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        const { role } = decoded;
        const user = yield user_model_1.User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: 'You have no access to this route',
            });
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: 'You have no access to this route',
            });
        }
        req.user = user;
        next();
    }));
};
exports.default = auth;
