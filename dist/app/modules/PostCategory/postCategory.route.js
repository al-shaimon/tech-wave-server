"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const postCategory_controller_1 = require("./postCategory.controller");
const postCategory_validation_1 = require("./postCategory.validation");
const auth_1 = __importDefault(require("../../middleWares/auth"));
const validateRequest_1 = __importDefault(require("../../middleWares/validateRequest"));
const router = express_1.default.Router();
router.get('/', postCategory_controller_1.PostCategoryControllers.getAllPostCategories);
router.get('/:id', postCategory_controller_1.PostCategoryControllers.getPostCategoryById);
router.post('/', (0, auth_1.default)('admin'), (0, validateRequest_1.default)(postCategory_validation_1.PostCategoryValidation.createPostCategoryValidationSchema), postCategory_controller_1.PostCategoryControllers.createPostCategory);
router.put('/:id', (0, auth_1.default)('admin'), (0, validateRequest_1.default)(postCategory_validation_1.PostCategoryValidation.updatePostCategoryValidationSchema), postCategory_controller_1.PostCategoryControllers.updatePostCategory);
router.delete('/:id', (0, auth_1.default)('admin'), postCategory_controller_1.PostCategoryControllers.deletePostCategory);
exports.PostCategoryRoutes = router;
