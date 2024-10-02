/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryBuilder } from '../../builder/QueryBuilder';
import { PostsSearchableFields } from './post.constant';
import { TPost } from './post.interface';
import { Post } from './post.model';
import {
  SearchItemByCategoryQueryMaker,
  SearchItemByDateRangeQueryMaker,
  SearchItemByUserQueryMaker,
} from './post.utils';

const createPostIntoDB = async (payload: TPost) => {
  const result = await Post.create(payload);

  return result;
};

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  query = (await SearchItemByUserQueryMaker(query)) || query;
  query = (await SearchItemByDateRangeQueryMaker(query)) || query;

  const categoryQuery = await SearchItemByCategoryQueryMaker(query);
  if (categoryQuery.category && (categoryQuery.category as any).$in) {
    query = { ...query, ...categoryQuery };
  } else {
    query = { ...query, ...(await SearchItemByCategoryQueryMaker(query)) };
  }

  const itemQuery = new QueryBuilder(
    Post.find().populate('user').populate('category'),
    query
  )
    .filter()
    .search(PostsSearchableFields)
    .sort()
    .fields();

  const result = await itemQuery.modelQuery;

  return result;
};

const getPostFromDB = async (postId: string) => {
  const result = await Post.findById(postId)
    .populate('user')
    .populate('category');
  return result;
};

// const updateItemInDB = async (itemId: string, payload: TItem) => {
//   const result = await Item.findByIdAndUpdate(itemId, payload, { new: true });
//   if (result) {
//     await addDocumentToIndex(result, 'items');
//   } else {
//     throw new Error(`Item with ID ${itemId} not found.`);
//   }
//   return result;
// };

// const deleteItemFromDB = async (itemId: string) => {
//   const result = await Item.findByIdAndDelete(itemId);
//   const deletedItemId = result?._id;
//   if (deletedItemId) {
//     await deleteDocumentFromIndex('items', deletedItemId.toString());
//   }

//   return result;
// };

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostFromDB,
  // updateItemInDB,
  // deleteItemFromDB,
};
