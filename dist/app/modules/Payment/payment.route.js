"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const authMiddleware_1 = __importDefault(require("../User/authMiddleware"));
const auth_1 = __importDefault(require("../../middleWares/auth"));
const adminMiddleware_1 = require("../User/adminMiddleware");
const router = express_1.default.Router();
router.post('/create-payment-intent', authMiddleware_1.default, payment_controller_1.PaymentController.createPaymentIntent);
router.post('/confirm-payment', authMiddleware_1.default, payment_controller_1.PaymentController.confirmPayment);
router.get('/', (0, auth_1.default)('admin'), adminMiddleware_1.adminMiddleware, payment_controller_1.PaymentController.getAllPaymentHistory);
exports.PaymentRoutes = router;
