import { DuaReference, DuaAudio } from '@/types/dua.types';
import { BloodRequestItem } from '@/features/blood/types/blood.types';

export type PostType = 'TEXT' | 'DUA' | 'BLOOD_REQUEST' | 'QUESTION' | 'ANNOUNCEMENT';
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
  title?: string;
  fadilah?: string | null;
  transliteration?: string | null;
  meaning?: string;
  meaningBangla?: string;
  arabicText?: string | null;
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
  saveCount?: number;
  shareCount?: number;
}

export interface FeedViewerState {
  hasReacted: boolean;
  hasSaved: boolean;
}

export interface FeedItem {
  id: string;
  type: PostType;
  content: string | null;
  mediaUrls?: string[];
  mediaLayout?: 'COLLAGE' | 'SWIPE';
  feeling?: string | null;
  createdAt: string;
  visibility?: PostVisibility;
  status?: PostStatus;
  author: FeedAuthor;
  dua: FeedDua | null;
  bloodRequestId?: string | null;
  bloodRequest?: BloodRequestItem | null;
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
  mediaUrls?: string[];
  mediaLayout?: 'COLLAGE' | 'SWIPE';
  feeling?: string;
  duaId?: string;
  duaData?: {
    title?: string;
    transliteration?: string;
    meaning: string;
    fadilah?: string;
    arabicText?: string;
  };
  bloodRequestId?: string;
  bloodRequestData?: any;
  visibility?: PostVisibility;
  status?: PostStatus;
}

export interface UpdatePostInput {
  content?: string;
  mediaUrls?: string[];
  mediaLayout?: 'COLLAGE' | 'SWIPE';
  feeling?: string;
  visibility?: PostVisibility;
  status?: PostStatus;
}
