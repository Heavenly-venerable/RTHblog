import { CommentController } from '~/server/controllers/comment.controller';

const controller = new CommentController();

export default defineEventHandler(async (event) => {
  return await controller.deleteComment(event);
});
