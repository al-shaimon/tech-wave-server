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
exports.PostControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
// import AppError from '../../errors/AppError';
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const post_service_1 = require("./post.service");
const createPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postData = req.body;
    postData.user = req.user.id; // Assuming you have user information in the request
    postData.isPaid = postData.isPaid || false; // Set default to false if not provided
    const post = yield post_service_1.PostServices.createPostIntoDB(postData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Post created successfully',
        data: post,
    });
}));
const getAllPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_service_1.PostServices.getAllPostsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Post retrieved successfully',
        data: post,
    });
}));
const getPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const post = yield post_service_1.PostServices.getPostFromDB(postId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Post retrieved successfully',
        data: post,
    });
}));
const updatePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const updatedPost = yield post_service_1.PostServices.updatePostIntoDB(postId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Post updated successfully',
        data: updatedPost,
    });
}));
const deletePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user.id;
    const post = yield post_service_1.PostServices.getPostFromDB(id);
    if (!post) {
        throw new Error('Post not found');
    }
    if (post.user._id.toString() !== userId) {
        throw new Error('You are not authorized to delete this post');
    }
    yield post_service_1.PostServices.deletePostFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Post deleted successfully',
        data: null,
    });
}));
const deletePostByAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield post_service_1.PostServices.getPostFromDB(id);
    if (!post) {
        throw new Error('Post not found');
    }
    yield post_service_1.PostServices.deletePostFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Post deleted successfully by admin',
        data: null,
    });
}));
exports.PostControllers = {
    createPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost,
    deletePostByAdmin,
};
