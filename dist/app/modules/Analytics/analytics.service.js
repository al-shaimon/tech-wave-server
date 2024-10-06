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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const post_model_1 = require("../Post/post.model");
const comment_model_1 = require("../Comment/comment.model");
const getAnalytics = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_model_1.Post.find({ user: userId });
    const shareCounts = posts.reduce((sum, post) => sum + (post.shareCounts || 0), 0);
    const reactionCounts = posts.reduce((sum, post) => sum + (post.votes || 0), 0);
    const viewCounts = posts.reduce((sum, post) => sum + (post.viewCounts || 0), 0);
    const commentCounts = yield comment_model_1.Comment.countDocuments({ post: { $in: posts.map(post => post._id) } });
    return {
        shareCounts,
        reactionCounts,
        commentCounts,
        viewCounts,
    };
});
exports.AnalyticsService = {
    getAnalytics,
};
