import { Category } from './category.types';

export type DuaStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type SourceType = 'QURAN' | 'HADITH' | 'OTHER';

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DuaReference {
  id: string;
  duaId: string;
  sourceId: string;
  reference: string;
  note?: string | null;
  verified: boolean;
  source?: Source;
  createdAt: string;
  updatedAt: string;
}

export interface DuaAudio {
  id: string;
  duaId: string;
  audioUrl: string;
  reciterName?: string | null;
  duration?: number | null;
  language?: string | null;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Dua {
  id: string;
  title: string;
  fadilah: string;
  duaBangla: string;
  meaningBangla: string;
  arabicText?: string | null;
  transliteration?: string | null;
  categoryId: string;
  createdById: string;
  status: DuaStatus;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  references?: DuaReference[];
  audios?: DuaAudio[];
  isSaved?: boolean;
  _count?: {
    references: number;
    audios: number;
    savedBy: number;
  };
}

export interface SavedDuaItem extends Dua {
  bookmarkId: string;
  savedAt: string;
}
