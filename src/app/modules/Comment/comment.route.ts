import express from 'express';
import { CommentController } from './comment.controller';
import auth from '../../middleWares/auth';

const router = express.Router();

router.post('/', auth('user'), CommentController.createComment);
router.get('/post/:postId', CommentController.getCommentsByPost);
router.put('/:commentId', auth('user'), CommentController.updateComment);
router.delete('/:commentId', auth('user'), CommentController.deleteComment);

export const CommentRoutes = router;
