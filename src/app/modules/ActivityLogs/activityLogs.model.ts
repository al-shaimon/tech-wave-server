import { Schema, model } from 'mongoose';
import { TActivityLog } from './activityLogs.interface';


const ActivityLogSchema = new Schema<TActivityLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const ActivityLog = model<TActivityLog>(
  'ActivityLog',
  ActivityLogSchema
);
