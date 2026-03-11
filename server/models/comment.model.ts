import { db } from '../utils/db';
import { comments, replies, type Comment, type NewComment, type Reply, type NewReply } from '../database/schema';
import { eq, and, desc } from 'drizzle-orm';

export class CommentModel {
  // Comments
  async findAllByArticleId(articleId: string): Promise<Comment[]> {
    return await db.query.comments.findMany({
      where: and(
        eq(comments.articleId, articleId),
        eq(comments.isDeleted, false)
      ),
      orderBy: [desc(comments.createdAt)],
      with: {
        replies: {
          where: eq(replies.isDeleted, false),
          orderBy: [desc(replies.createdAt)],
        },
      },
    });
  }

  async findById(id: number): Promise<Comment | undefined> {
    return await db.query.comments.findFirst({
      where: and(
        eq(comments.id, id),
        eq(comments.isDeleted, false)
      ),
      with: {
        replies: {
          where: eq(replies.isDeleted, false),
          orderBy: [desc(replies.createdAt)],
        },
      },
    });
  }

  async create(data: NewComment): Promise<Comment> {
    const result = await db.insert(comments).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<NewComment>): Promise<Comment | undefined> {
    const result = await db
      .update(comments)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(comments.id, id), eq(comments.isDeleted, false)))
      .returning();
    return result[0];
  }

  async softDelete(id: number): Promise<Comment | undefined> {
    const result = await db
      .update(comments)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(comments.id, id))
      .returning();
    return result[0];
  }

  async hardDelete(id: number): Promise<Comment | undefined> {
    const result = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning();
    return result[0];
  }

  // Replies
  async findReplyById(id: number): Promise<Reply | undefined> {
    return await db.query.replies.findFirst({
      where: and(
        eq(replies.id, id),
        eq(replies.isDeleted, false)
      ),
    });
  }

  async createReply(data: NewReply): Promise<Reply> {
    const result = await db.insert(replies).values(data).returning();
    return result[0];
  }

  async updateReply(id: number, data: Partial<NewReply>): Promise<Reply | undefined> {
    const result = await db
      .update(replies)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(replies.id, id), eq(replies.isDeleted, false)))
      .returning();
    return result[0];
  }

  async softDeleteReply(id: number): Promise<Reply | undefined> {
    const result = await db
      .update(replies)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(replies.id, id))
      .returning();
    return result[0];
  }

  async hardDeleteReply(id: number): Promise<Reply | undefined> {
    const result = await db
      .delete(replies)
      .where(eq(replies.id, id))
      .returning();
    return result[0];
  }

  async deleteRepliesByCommentId(commentId: number): Promise<void> {
    await db
      .update(replies)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(replies.commentId, commentId));
  }
}
