import { Post } from '../Post/post.model';
import { Comment } from '../Comment/comment.model';

const getAnalytics = async (userId: string) => {
  const posts = await Post.find({ user: userId });

  const shareCounts = posts.reduce((sum, post) => sum + (post.shareCounts || 0), 0);
  const reactionCounts = posts.reduce((sum, post) => sum + (post.votes || 0), 0);
  const viewCounts = posts.reduce((sum, post) => sum + (post.viewCounts || 0), 0);

  const commentCounts = await Comment.countDocuments({ post: { $in: posts.map(post => post._id) } });

  return {
    shareCounts,
    reactionCounts,
    commentCounts,
    viewCounts,
  };
};

export const AnalyticsService = {
  getAnalytics,
};
