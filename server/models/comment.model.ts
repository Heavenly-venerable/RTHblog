import { db } from '../utils/db';
import { comments, replies } from '../database/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export class CommentModel {
  // Comments
  async findAllByArticleId(articleId: string) {
    // Ambil semua comments dulu
    const commentsData = await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.articleId, articleId),
          eq(comments.isDeleted, false)
        )
      )
      .orderBy(desc(comments.createdAt));

    // Untuk setiap comment, ambil replies-nya
    const result = [];
    for (const comment of commentsData) {
      const repliesData = await db
        .select()
        .from(replies)
        .where(
          and(
            eq(replies.commentId, comment.id),
            eq(replies.isDeleted, false)
          )
        )
        .orderBy(desc(replies.createdAt));

      result.push({
        ...comment,
        replies: repliesData
      });
    }

    return result;
  }

  async findById(id: number) {
    const comment = await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.id, id),
          eq(comments.isDeleted, false)
        )
      )
      .limit(1);

    if (comment.length === 0) return undefined;

    const repliesData = await db
      .select()
      .from(replies)
      .where(
        and(
          eq(replies.commentId, id),
          eq(replies.isDeleted, false)
        )
      )
      .orderBy(desc(replies.createdAt));

    return {
      ...comment[0],
      replies: repliesData
    };
  }

  async create(data: any) {
    const result = await db
      .insert(comments)
      .values({
        articleId: data.articleId,
        author: data.author,
        content: data.content,
      })
      .returning();

    return {
      ...result[0],
      replies: []
    };
  }

  async update(id: number, data: any) {
    const result = await db
      .update(comments)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(comments.id, id), eq(comments.isDeleted, false)))
      .returning();

    if (result.length === 0) return undefined;

    const repliesData = await db
      .select()
      .from(replies)
      .where(
        and(
          eq(replies.commentId, id),
          eq(replies.isDeleted, false)
        )
      )
      .orderBy(desc(replies.createdAt));

    return {
      ...result[0],
      replies: repliesData
    };
  }

  async softDelete(id: number) {
    const result = await db
      .update(comments)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(comments.id, id))
      .returning();

    return result[0];
  }

  async hardDelete(id: number) {
    const result = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning();

    return result[0];
  }

  async findReplyById(id: number) {
    const result = await db
      .select()
      .from(replies)
      .where(
        and(
          eq(replies.id, id),
          eq(replies.isDeleted, false)
        )
      )
      .limit(1);

    return result[0];
  }

  async createReply(data: any) {
    const result = await db
      .insert(replies)
      .values({
        commentId: data.commentId,
        author: data.author,
        content: data.content,
      })
      .returning();

    return result[0];
  }

  async updateReply(id: number, data: any) {
    const result = await db
      .update(replies)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(replies.id, id), eq(replies.isDeleted, false)))
      .returning();

    return result[0];
  }

  async softDeleteReply(id: number) {
    const result = await db
      .update(replies)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(replies.id, id))
      .returning();

    return result[0];
  }

  async hardDeleteReply(id: number) {
    const result = await db
      .delete(replies)
      .where(eq(replies.id, id))
      .returning();

    return result[0];
  }

  async softDeleteRepliesByCommentId(commentId: number) {
    await db
      .update(replies)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(replies.commentId, commentId));
  }
}
