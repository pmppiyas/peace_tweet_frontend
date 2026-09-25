import { DuaReference, DuaAudio } from '@/types/dua.types';

export type PostType = 'TEXT' | 'DUA' | 'QUESTION' | 'ANNOUNCEMENT';
export type PostVisibility = 'PUBLIC' | 'FOLLOWERS' | 'GROUP';
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'HIDDEN';

export interface FeedAuthor {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
}

export interface FeedDua {
  id: string;
  title: string;
  fadilah: string;
  duaBangla: string;
  meaningBangla: string;
  arabicText?: string | null;
  transliteration?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  references: DuaReference[];
  audios: DuaAudio[];
  audioUrl?: string | null;
}

export interface FeedStats {
  reactionCount: number;
  commentCount: number;
}

export interface FeedViewerState {
  hasReacted: boolean;
  hasSaved: boolean;
}

export interface FeedItem {
  id: string;
  type: PostType;
  content: string | null;
  createdAt: string;
  visibility?: PostVisibility;
  status?: PostStatus;
  author: FeedAuthor;
  dua: FeedDua | null;
  stats: FeedStats;
  viewer: FeedViewerState;
}

export interface FeedResponse {
  items: FeedItem[];
  nextCursor: string | null;
}

export interface FeedFilters {
  cursor?: string;
  limit?: number;
  type?: PostType;
}

export interface PostComment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: FeedAuthor;
}

export interface CreatePostInput {
  type: PostType;
  content?: string;
  duaId?: string;
  visibility?: PostVisibility;
  status?: PostStatus;
}

export interface UpdatePostInput {
  content?: string;
  visibility?: PostVisibility;
  status?: PostStatus;
}
