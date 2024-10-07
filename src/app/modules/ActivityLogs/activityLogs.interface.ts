import { Types } from 'mongoose';

export type TActivityLog = {
  user: Types.ObjectId;
  action: string;
  timestamp: Date;
};
