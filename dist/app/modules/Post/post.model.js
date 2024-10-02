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
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const postCategory_model_1 = require("../PostCategory/postCategory.model");
const postSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    videos: {
        type: [String],
        default: [],
    },
    votes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Comment',
        default: [],
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'PostCategory',
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
    virtuals: true,
});
// Middleware to increment post count in associated category
postSchema.post('save', function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield postCategory_model_1.PostCategory.findByIdAndUpdate(doc.category, {
                $inc: { postCount: 1 },
            });
        }
        catch (error) {
            throw new Error(`Failed to increment post count for category ${doc.category}: ${error}`);
        }
    });
});
exports.Post = (0, mongoose_1.model)('Post', postSchema);
