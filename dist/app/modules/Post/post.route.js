"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleWares/validateRequest"));
const post_controller_1 = require("./post.controller");
const post_validation_1 = require("./post.validation");
const auth_1 = __importDefault(require("../../middleWares/auth"));
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)('user'), (0, validateRequest_1.default)(post_validation_1.PostValidation.createPostValidationSchema), post_controller_1.PostControllers.createPost);
router.get('/', post_controller_1.PostControllers.getAllPosts);
router.get('/:id', post_controller_1.PostControllers.getPost);
router.put('/:id', 
// auth('user'),
(0, validateRequest_1.default)(post_validation_1.PostValidation.updatePostValidationSchema), post_controller_1.PostControllers.updatePost);
router.delete('/:id', (0, auth_1.default)('user'), post_controller_1.PostControllers.deletePost);
exports.PostRoutes = router;
