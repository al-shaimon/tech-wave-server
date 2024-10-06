import httpStatus from 'http-status';
// import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';

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
  await PostServices.deletePostFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post deleted successfully',
    data: null,
  });
});

export const PostControllers = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
};
