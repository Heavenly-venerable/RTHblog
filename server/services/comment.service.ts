import { CommentModel } from '../models/comment.model';
import type { 
  CreateCommentDto, 
  UpdateCommentDto, 
  CreateReplyDto, 
  UpdateReplyDto,
  CommentResponse,
  ReplyResponse 
} from '../types/comment';

export class CommentService {
  private model: CommentModel;

  constructor() {
    this.model = new CommentModel();
  }

  private formatComment(comment: any): CommentResponse {
    return {
      id: comment.id,
      articleId: comment.articleId,
      author: comment.author,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      replies: comment.replies?.map((reply: any) => this.formatReply(reply)),
    };
  }

  private formatReply(reply: any): ReplyResponse {
    return {
      id: reply.id,
      commentId: reply.commentId,
      author: reply.author,
      content: reply.content,
      createdAt: reply.createdAt.toISOString(),
      updatedAt: reply.updatedAt.toISOString(),
    };
  }

  async getCommentsByArticleId(articleId: string): Promise<CommentResponse[]> {
    const comments = await this.model.findAllByArticleId(articleId);
    return comments.map(comment => this.formatComment(comment));
  }

  async getCommentById(id: number): Promise<CommentResponse | null> {
    const comment = await this.model.findById(id);
    return comment ? this.formatComment(comment) : null;
  }

  async createComment(data: CreateCommentDto): Promise<CommentResponse> {
    const comment = await this.model.create({
      articleId: data.articleId,
      author: data.author,
      content: data.content,
    });
    return this.formatComment(comment);
  }

  async updateComment(id: number, data: UpdateCommentDto): Promise<CommentResponse | null> {
    const comment = await this.model.update(id, data);
    return comment ? this.formatComment(comment) : null;
  }

  async deleteComment(id: number, permanent: boolean = false): Promise<boolean> {
    if (permanent) {
      // Hapus replies dulu
      await this.model.deleteRepliesByCommentId(id);
      const result = await this.model.hardDelete(id);
      return !!result;
    } else {
      // Soft delete comment dan replies
      await this.model.deleteRepliesByCommentId(id);
      const result = await this.model.softDelete(id);
      return !!result;
    }
  }

  async createReply(data: CreateReplyDto): Promise<ReplyResponse> {
    // Cek apakah comment masih ada
    const comment = await this.model.findById(data.commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    const reply = await this.model.createReply({
      commentId: data.commentId,
      author: data.author,
      content: data.content,
    });
    return this.formatReply(reply);
  }

  async updateReply(id: number, data: UpdateReplyDto): Promise<ReplyResponse | null> {
    const reply = await this.model.updateReply(id, data);
    return reply ? this.formatReply(reply) : null;
  }

  async deleteReply(id: number, permanent: boolean = false): Promise<boolean> {
    if (permanent) {
      const result = await this.model.hardDeleteReply(id);
      return !!result;
    } else {
      const result = await this.model.softDeleteReply(id);
      return !!result;
    }
  }
}
