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
const post_utils_1 = require("./post.utils");
const createPostIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.create(payload);
    // Add the post to the user's posts array
    yield user_model_1.User.findByIdAndUpdate(payload.user, {
        $push: { posts: result._id },
    });
    return result;
});
const getAllPostsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    query = (yield (0, post_utils_1.SearchItemByUserQueryMaker)(query)) || query;
    query = (yield (0, post_utils_1.SearchItemByDateRangeQueryMaker)(query)) || query;
    const categoryQuery = yield (0, post_utils_1.SearchItemByCategoryQueryMaker)(query);
    if (categoryQuery.category && categoryQuery.category.$in) {
        query = Object.assign(Object.assign({}, query), categoryQuery);
    }
    else {
        query = Object.assign(Object.assign({}, query), (yield (0, post_utils_1.SearchItemByCategoryQueryMaker)(query)));
    }
    const itemQuery = new QueryBuilder_1.QueryBuilder(post_model_1.Post.find().populate('user').populate('category').populate('comments'), query)
        .filter()
        .search(post_constant_1.PostsSearchableFields)
        .sort()
        .fields();
    const result = yield itemQuery.modelQuery;
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
// const deleteItemFromDB = async (itemId: string) => {
//   const result = await Item.findByIdAndDelete(itemId);
//   const deletedItemId = result?._id;
//   if (deletedItemId) {
//     await deleteDocumentFromIndex('items', deletedItemId.toString());
//   }
//   return result;
// };
exports.PostServices = {
    createPostIntoDB,
    getAllPostsFromDB,
    getPostFromDB,
    updatePostIntoDB,
    // deleteItemFromDB,
};
