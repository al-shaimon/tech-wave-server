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
exports.PostServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const user_model_1 = require("../User/user.model");
const post_constant_1 = require("./post.constant");
const post_model_1 = require("./post.model");
// import {
//   SearchItemByCategoryQueryMaker,
//   SearchItemByDateRangeQueryMaker,
//   SearchItemByUserQueryMaker,
// } from './post.utils';
const createPostIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.create(payload);
    // Add the post to the user's posts array
    yield user_model_1.User.findByIdAndUpdate(payload.user, {
        $push: { posts: result._id },
    });
    return result;
});
const getAllPostsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const postQuery = new QueryBuilder_1.QueryBuilder(post_model_1.Post, query)
        .search(post_constant_1.PostsSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield postQuery.modelQuery
        .populate('user')
        .populate('category', 'name')
        .populate({
        path: 'comments',
        populate: {
            path: 'user',
            select: 'name email profilePhoto',
        },
    });
    return result;
});
const getPostFromDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findById(postId)
        .populate('user')
        .populate('category');
    return result;
});
const updatePostIntoDB = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findByIdAndUpdate(postId, payload, { new: true });
    return result;
});
const deletePostFromDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findByIdAndDelete(postId);
    return result;
});
exports.PostServices = {
    createPostIntoDB,
    getAllPostsFromDB,
    getPostFromDB,
    updatePostIntoDB,
    deletePostFromDB,
};
