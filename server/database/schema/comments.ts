import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Comments table
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  articleId: varchar('article_id', { length: 255 }).notNull(),
  author: varchar('author', { length: 100 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isDeleted: boolean('is_deleted').default(false).notNull(),
});

// Replies table
export const replies = pgTable('replies', {
  id: serial('id').primaryKey(),
  commentId: integer('comment_id').references(() => comments.id).notNull(),
  author: varchar('author', { length: 100 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isDeleted: boolean('is_deleted').default(false).notNull(),
});

// Relations
export const commentsRelations = relations(comments, ({ many }) => ({
  replies: many(replies),
}));

export const repliesRelations = relations(replies, ({ one }) => ({
  comment: one(comments, {
    fields: [replies.commentId],
    references: [comments.id],
  }),
}));

// Types
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Reply = typeof replies.$inferSelect;
export type NewReply = typeof replies.$inferInsert;

// Comment with replies
export type CommentWithReplies = Comment & {
  replies: Reply[];
};
