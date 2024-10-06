import { ObjectId, Types } from 'mongoose';

export type TPost = {
  content: string;
  images?: string[];
  videos?: string[];
  category: ObjectId;
  votes?: number;
  comments: Types.ObjectId[];
  commentCount: number;
  user: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  isPaid: boolean;
  shareCounts: number;
  viewCounts: number;
};
