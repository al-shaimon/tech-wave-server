"use strict";
// src/app/modules/Analytics/analytics.route.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const analytics_controller_1 = require("./analytics.controller");
const auth_1 = __importDefault(require("../../middleWares/auth"));
const router = express_1.default.Router();
router.get('/:userId', (0, auth_1.default)('user'), analytics_controller_1.AnalyticsController.getAnalytics);
exports.AnalyticsRoutes = router;
