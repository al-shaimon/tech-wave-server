/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryBuilder } from '../../builder/QueryBuilder';
import { User } from '../User/user.model';
import { PostsSearchableFields } from './post.constant';
import { TPost } from './post.interface';
import { Post } from './post.model';
// import {
//   SearchItemByCategoryQueryMaker,
//   SearchItemByDateRangeQueryMaker,
//   SearchItemByUserQueryMaker,
// } from './post.utils';

const createPostIntoDB = async (payload: TPost) => {
  const result = await Post.create(payload);

  // Add the post to the user's posts array
  await User.findByIdAndUpdate(payload.user, {
    $push: { posts: result._id },
  });

  return result;
};

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Post, query)
    .search(PostsSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery
    .populate('user', 'name email profilePhoto')
    .populate('category', 'name')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name email profilePhoto',
      },
    });

  return result;
};

const getPostFromDB = async (postId: string) => {
  const result = await Post.findById(postId)
    .populate('user')
    .populate('category');
  return result;
};

const updatePostIntoDB = async (postId: string, payload: TPost) => {
  const result = await Post.findByIdAndUpdate(postId, payload, { new: true });

  return result;
};

const deletePostFromDB = async (postId: string) => {
  const result = await Post.findByIdAndDelete(postId);

  return result;
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostFromDB,
  updatePostIntoDB,
  deletePostFromDB,
};
