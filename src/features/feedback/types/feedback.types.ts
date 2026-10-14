export type FeedbackType =
  | 'SUGGESTION'
  | 'BUG'
  | 'REPORT_CONTENT'
  | 'BUSINESS'
  | 'OTHER';

export type FeedbackStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'RESOLVED'
  | 'DISMISSED';

export interface CreateFeedbackPayload {
  type: FeedbackType;
  subject: string;
  message: string;
  email?: string;
  targetUrl?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  attachments?: string[];
}

export interface FeedbackItem {
  id: string;
  userId?: string | null;
  type: FeedbackType;
  subject: string;
  message: string;
  email?: string | null;
  targetUrl?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
  attachments: string[];
  status: FeedbackStatus;
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    username: string;
    avatar?: string | null;
    isVerified?: boolean;
  } | null;
}
