export interface Reply {
  id: number;
  commentId: number;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  articleId: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  replies?: Reply[];
}

export interface CreateCommentDto {
  articleId: string;
  author: string;
  content: string;
}

export interface CreateReplyDto {
  commentId: number;
  author: string;
  content: string;
}

// Response types
export interface CommentsResponse {
  data: Comment[];
}

export interface CommentResponse {
  data: Comment;
}

export interface ReplyResponse {
  data: Reply;
}
