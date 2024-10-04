"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("./comment.controller");
const auth_1 = __importDefault(require("../../middleWares/auth"));
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)('user'), comment_controller_1.CommentController.createComment);
router.get('/post/:postId', comment_controller_1.CommentController.getCommentsByPost);
router.put('/:commentId', (0, auth_1.default)('user'), comment_controller_1.CommentController.updateComment);
router.delete('/:commentId', (0, auth_1.default)('user'), comment_controller_1.CommentController.deleteComment);
exports.CommentRoutes = router;
