export type DocumentStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee extends User {
  classification: 'Manager' | 'Senior' | 'Associate' | 'Junior';
  office: string;
  role: string;
  department: string;
}

export interface Client extends User {
  phone: string;
  email: string;
  firmName: string;
  firmAddress: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  approverId?: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface DocumentUploadRequest {
  title: string;
  content: string;
  authorId: string;
  approverId?: string;
}

export interface DocumentApprovalRequest {
  documentId: string;
  approverId: string;
  status: 'approved' | 'rejected';
  comment?: string;
}

export interface ChatMessage {
  id: string;
  documentId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface NotificationEvent {
  type: 'document_uploaded' | 'document_approved' | 'document_rejected' | 'user_added';
  userId: string;
  data: any;
  timestamp: string;
}
