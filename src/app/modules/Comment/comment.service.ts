import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TComment, TCommentResponse } from './comment.interface';
import { Comment } from './comment.model';
import { Post } from '../Post/post.model';
import { User } from '../User/user.model'; // Assuming User model is imported

const createComment = async (payload: TComment): Promise<TCommentResponse> => {
  const post = await Post.findById(payload.post);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const comment = await Comment.create(payload);
  await Post.findByIdAndUpdate(payload.post, {
    $push: { comments: comment._id },
    $inc: { commentCount: 1 },
  });

  return getPopulatedComment(comment._id.toString());
};

const getCommentsByPost = async (
  postId: string
): Promise<TCommentResponse[]> => {
  const comments = await Comment.find({ post: postId }).sort({ createdAt: -1 });
  return Promise.all(
    comments.map((comment) => getPopulatedComment(comment._id.toString()))
  );
};

const updateComment = async (
  commentId: string,
  userId: string,
  content: string
): Promise<TCommentResponse> => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  if (comment.user.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this comment'
    );
  }

  comment.content = content;
  await comment.save();

  return getPopulatedComment(comment._id.toString());
};

const deleteComment = async (
  commentId: string,
  userId: string
): Promise<void> => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  if (comment.user.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this comment'
    );
  }

  await Comment.findByIdAndDelete(commentId);
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: commentId },
    $inc: { commentCount: -1 },
  });
};

const getPopulatedComment = async (
  commentId: string
): Promise<TCommentResponse> => {
  const comment = await Comment.findById(commentId).populate({
    path: 'user',
    select: 'name email profilePhoto',
  }).populate({
    path: 'post',
    select: 'content images videos votes category',
  });
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  const commentObj = comment.toObject();
  const populatedUser = await User.findById(commentObj.user).lean();
  return {
    ...commentObj,
    user: {
      _id: populatedUser?._id ?? '',
      name: populatedUser?.name ?? '',
      email: populatedUser?.email ?? '',
      profilePhoto: populatedUser?.profilePhoto,
    },
  } as TCommentResponse;
};

export const CommentService = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};
