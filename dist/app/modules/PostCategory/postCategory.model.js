"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCategory = void 0;
const mongoose_1 = require("mongoose");
// Define the schema
const PostCategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    postCount: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.PostCategory = (0, mongoose_1.model)('PostCategory', PostCategorySchema);
