import { ActivityLog } from "./activityLogs.model";


const getActivityLogs = async () => {
  return await ActivityLog.find()
    .populate('user', 'name email role')
    .sort({ timestamp: -1 });
};

export const ActivityLogService = {
  getActivityLogs,
};
