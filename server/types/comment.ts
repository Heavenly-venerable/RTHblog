export interface CreateCommentDto {
  articleId: string;
  author: string;
  content: string;
}

export interface UpdateCommentDto {
  author?: string;
  content?: string;
}

export interface CreateReplyDto {
  commentId: number;
  author: string;
  content: string;
}

export interface UpdateReplyDto {
  author?: string;
  content?: string;
}

export interface CommentResponse {
  id: number;
  articleId: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  replies?: ReplyResponse[];
}

export interface ReplyResponse {
  id: number;
  commentId: number;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
