import { CommentService } from '../services/comment.service';
import type { H3Event } from 'h3';

export class CommentController {
  private service: CommentService;

  constructor() {
    this.service = new CommentService();
  }

  // GET /api/comments/article/:articleId
  async getCommentsByArticleId(event: H3Event) {
    try {
      const articleId = event.context.params?.articleId;
      
      if (!articleId) {
        return createError({
          statusCode: 400,
          statusMessage: 'Article ID is required',
        });
      }

      const comments = await this.service.getCommentsByArticleId(articleId);
      return { data: comments };
    } catch (error) {
      console.error('Error getting comments:', error);
      return createError({
        statusCode: 500,
        statusMessage: 'Internal server error',
      });
    }
  }

  // GET /api/comments/:id
  async getCommentById(event: H3Event) {
    try {
      const id = Number(event.context.params?.id);
      
      if (isNaN(id)) {
        return createError({
          statusCode: 400,
          statusMessage: 'Invalid comment ID',
        });
      }

      const comment = await this.service.getCommentById(id);
      
      if (!comment) {
        return createError({
          statusCode: 404,
          statusMessage: 'Comment not found',
        });
      }

      return { data: comment };
    } catch (error) {
      console.error('Error getting comment:', error);
      return createError({
        statusCode: 500,
        statusMessage: 'Internal server error',
      });
    }
  }

  // POST /api/comments
  async createComment(event: H3Event) {
    try {
      const body = await readBody(event);
      
      if (!body.articleId || !body.author || !body.content) {
        return createError({
          statusCode: 400,
          statusMessage: 'Missing required fields: articleId, author, content',
        });
      }

      const comment = await this.service.createComment({
        articleId: body.articleId,
        author: body.author,
        content: body.content,
      });

      return { 
        data: comment,
        message: 'Comment created successfully' 
      };
    } catch (error) {
      console.error('Error creating comment:', error);
      return createError({
        statusCode: 500,
        statusMessage: 'Internal server error',
      });
    }
  }

  // PUT /api/comments/:id
  async updateComment(event: H3Event) {
    try {
      const id = Number(event.context.params?.id);
      
      if (isNaN(id)) {
        return createError({
          statusCode: 400,
          statusMessage: 'Invalid comment ID',
        });
      }

      const body = await readBody(event);
      
      if (!body.author && !body.content) {
        return createError({
          statusCode: 400,
          statusMessage: 'No fields to update',
        });
      }

      const comment = await this.service.updateComment(id, {
        author: body.author,
        content: body.content,
      });

      if (!comment) {
        return createError({
          statusCode: 404,
          statusMessage: 'Comment not found',
        });
      }

      return { 
        data: comment,
        message: 'Comment updated successfully' 
      };
    } catch (error) {
      console.error('Error updating comment:', error);
      return createError({
        statusCode: 500,
        statusMessage: 'Internal server error',
      });
    }
  }

  // DELETE /api/comments/:id
  async deleteComment(event: H3Event) {
    try {
      const id = Number(event.context.params?.id);
      const query = getQuery(event);
      const permanent = query.permanent === 'true';
      
      if (isNaN(id)) {
        return createError({
          statusCode: 400,
          statusMessage: 'Invalid comment ID',
        });
      }

      const deleted = await this.service.deleteComment(id, permanent);

      if (!deleted) {
        return createError({
          statusCode: 404,
          statusMessage: 'Comment not found',
        });
      }

      return { 
        message: `Comment ${permanent ? 'permanently deleted' : 'soft deleted'} successfully` 
      };
    } catch (error) {
      console.error('Error deleting comment:', error);
      return createError({
        statusCode: 500,
        statusMessage: 'Internal server error',
      });
    }
  }

  // POST /api/comments/:commentId/replies
  async createReply(event: H3Event) {
    try {
      const commentId = Number(event.context.params?.commentId);
      
      if (isNaN(commentId)) {
        return createError({
          statusCode: 400,
          statusMessage: 'Invalid comment ID',
        });
      }

      const body = await readBody(event);
      
      if (!body.author || !body.content) {
        return createError({
          statusCode: 400,
          statusMessage: 'Missing required fields: author, content',
        });
      }

      const reply = await this.service.createReply({
        commentId,
        author: body.author,
        content: body.content,
      });

      return { 
        data: reply,
        message: 'Reply created successfully' 
      };
    } catch (error: any) {
      console.error('Error creating reply:', error);
      
      if (error.message === 'Comment not found') {
        return createError({
          statusCode: 404,
          statusMessage: 'Comment not found',
        });
      }

      return createError({
        statusCode: 500,
        statusMessage: 'Internal server error',
      });
    }
  }

  // PUT /api/comments/replies/:id
  async updateReply(event: H3Event) {
    try {
      const id = Number(event.context.params?.id);
      
      if (isNaN(id)) {
        return createError({
          statusCode: 400,
          statusMessage: 'Invalid reply ID',
        });
      }

      const body = await readBody(event);
      
      if (!body.author && !body.content) {
        return createError({
          statusCode: 400,
          statusMessage: 'No fields to update',
        });
      }

      const reply = await this.service.updateReply(id, {
        author: body.author,
        content: body.content,
      });

      if (!reply) {
        return createError({
          statusCode: 404,
          statusMessage: 'Reply not found',
        });
      }

      return { 
        data: reply,
        message: 'Reply updated successfully' 
      };
    } catch (error) {
      console.error('Error updating reply:', error);
      return createError({
        statusCode: 500,
        statusMessage: 'Internal server error',
      });
    }
  }

  // DELETE /api/comments/replies/:id
  async deleteReply(event: H3Event) {
    try {
      const id = Number(event.context.params?.id);
      const query = getQuery(event);
      const permanent = query.permanent === 'true';
      
      if (isNaN(id)) {
        return createError({
          statusCode: 400,
          statusMessage: 'Invalid reply ID',
        });
      }

      const deleted = await this.service.deleteReply(id, permanent);

      if (!deleted) {
        return createError({
          statusCode: 404,
          statusMessage: 'Reply not found',
        });
      }

      return { 
        message: `Reply ${permanent ? 'permanently deleted' : 'soft deleted'} successfully` 
      };
    } catch (error) {
      console.error('Error deleting reply:', error);
      return createError({
        statusCode: 500,
        statusMessage: 'Internal server error',
      });
    }
  }
}
