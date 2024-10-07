"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const activityLogs_controller_1 = require("./activityLogs.controller");
const auth_1 = __importDefault(require("../../middleWares/auth"));
const adminMiddleware_1 = require("../User/adminMiddleware");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)('admin'), adminMiddleware_1.adminMiddleware, activityLogs_controller_1.ActivityLogController.getActivityLogs);
exports.ActivityLogRoutes = router;
