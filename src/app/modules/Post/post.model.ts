import { Schema, model, Document } from 'mongoose';
import { TPost } from './post.interface';
import { PostCategory } from '../PostCategory/postCategory.model';

const postSchema = new Schema<TPost>(
  {
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
      type: [Schema.Types.ObjectId],
      ref: 'Comment',
      default: [],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'PostCategory',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    virtuals: true,
  }
);

// Middleware to increment post count in associated category
postSchema.post('save', async function (doc: TPost & Document) {
  try {
    await PostCategory.findByIdAndUpdate(doc.category, {
      $inc: { postCount: 1 },
    });
  } catch (error) {
    throw new Error(
      `Failed to increment post count for category ${doc.category}: ${error}`
    );
  }
});

export const Post = model<TPost>('Post', postSchema);
