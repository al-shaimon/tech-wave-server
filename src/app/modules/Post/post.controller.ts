import httpStatus from 'http-status';
// import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';
import { ObjectId } from 'mongoose';

interface User {
  _id: ObjectId;
  // other user properties...
}

const createPost = catchAsync(async (req, res) => {
  const postData = req.body;
  postData.user = req.user.id; // Assuming you have user information in the request
  postData.isPaid = postData.isPaid || false; // Set default to false if not provided

  const post = await PostServices.createPostIntoDB(postData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Post created successfully',
    data: post,
  });
});

const getAllPosts = catchAsync(async (req, res) => {
  const post = await PostServices.getAllPostsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post retrieved successfully',
    data: post,
  });
});

const getPost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const post = await PostServices.getPostFromDB(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post retrieved successfully',
    data: post,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const updatedPost = await PostServices.updatePostIntoDB(postId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post updated successfully',
    data: updatedPost,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const post = await PostServices.getPostFromDB(id);

  if (!post) {
    throw new Error('Post not found');
  }

  if ((post.user as unknown as User)._id.toString() !== userId) {
    throw new Error('You are not authorized to delete this post');
  }

  await PostServices.deletePostFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post deleted successfully',
    data: null,
  });
});

const deletePostByAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;

  const post = await PostServices.getPostFromDB(id);

  if (!post) {
    throw new Error('Post not found');
  }

  await PostServices.deletePostFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post deleted successfully by admin',
    data: null,
  });
});

export const PostControllers = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  deletePostByAdmin,
};
