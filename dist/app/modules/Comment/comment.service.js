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
exports.CommentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const comment_model_1 = require("./comment.model");
const post_model_1 = require("../Post/post.model");
const user_model_1 = require("../User/user.model"); // Assuming User model is imported
const createComment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.Post.findById(payload.post);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    }
    const comment = yield comment_model_1.Comment.create(payload);
    yield post_model_1.Post.findByIdAndUpdate(payload.post, {
        $push: { comments: comment._id },
        $inc: { commentCount: 1 },
    });
    return getPopulatedComment(comment._id.toString());
});
const getCommentsByPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield comment_model_1.Comment.find({ post: postId }).sort({ createdAt: -1 });
    return Promise.all(comments.map((comment) => getPopulatedComment(comment._id.toString())));
});
const updateComment = (commentId, userId, content) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.Comment.findById(commentId);
    if (!comment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found');
    }
    if (comment.user.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to update this comment');
    }
    comment.content = content;
    yield comment.save();
    return getPopulatedComment(comment._id.toString());
});
const deleteComment = (commentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.Comment.findById(commentId);
    if (!comment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found');
    }
    if (comment.user.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to delete this comment');
    }
    yield comment_model_1.Comment.findByIdAndDelete(commentId);
    yield post_model_1.Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: commentId },
        $inc: { commentCount: -1 },
    });
});
const getPopulatedComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const comment = yield comment_model_1.Comment.findById(commentId).populate({
        path: 'user',
        select: 'name email profilePhoto',
    }).populate({
        path: 'post',
        select: 'content images videos votes category',
    });
    if (!comment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found');
    }
    const commentObj = comment.toObject();
    const populatedUser = yield user_model_1.User.findById(commentObj.user).lean();
    return Object.assign(Object.assign({}, commentObj), { user: {
            _id: (_a = populatedUser === null || populatedUser === void 0 ? void 0 : populatedUser._id) !== null && _a !== void 0 ? _a : '',
            name: (_b = populatedUser === null || populatedUser === void 0 ? void 0 : populatedUser.name) !== null && _b !== void 0 ? _b : '',
            email: (_c = populatedUser === null || populatedUser === void 0 ? void 0 : populatedUser.email) !== null && _c !== void 0 ? _c : '',
            profilePhoto: populatedUser === null || populatedUser === void 0 ? void 0 : populatedUser.profilePhoto,
        } });
});
exports.CommentService = {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment,
};
