import { ObjectId } from 'mongoose';

export type TPost = {
  content: string;
  images?: string[];
  videos?: string[];
  category: ObjectId;
  votes?: number;
  comments?: string[];
  user: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};
