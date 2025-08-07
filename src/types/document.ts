export interface DocumentFragment {
  id: string;
  documentId: string;
  text: string;
  page: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  createdAt: Date;
  createdBy: string;
}

export interface DocumentComment {
  id: string;
  documentId: string;
  fragmentId?: string; // Связь с фрагментом
  text: string;
  sender: string;
  timestamp: Date;
  replies?: DocumentComment[];
}

export interface Document {
  key: string;
  name: string;
  modified: string;
  createdBy: string;
  modifiedBy: string;
  owner: 'me' | 'other';
  shared: boolean;
  status: string;
  lock: boolean;
  type: 'pdf' | 'docx' | 'xlsx';
  url?: string;
} 