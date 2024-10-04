import { Types } from 'mongoose';

export type TComment = {
  content: string;
  post: Types.ObjectId;
  user: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TCommentResponse = {
  _id: Types.ObjectId;
  content: string;
  post: Types.ObjectId;
  user: {
    _id: Types.ObjectId;
    name: string;
    email: string;
    profilePhoto: string;
  };
  createdAt: Date;
  updatedAt: Date;
};
