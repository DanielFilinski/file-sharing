import { useState, useEffect, useCallback } from 'react';
import type { Document, DocumentStatus } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:7071/api';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка документов при инициализации
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/documents`);
      if (response.ok) {
        const documentsData = await response.json();
        setDocuments(documentsData);
      } else {
        throw new Error('Ошибка загрузки документов');
      }
    } catch (err) {
      setError('Ошибка загрузки документов');
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocumentById = useCallback(async (id: string): Promise<Document | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${id}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (err) {
      console.error('Error getting document:', err);
      return null;
    }
  }, []);

  const createDocument = async (documentData: {
    title: string;
    content: string;
    authorId: string;
    approverId?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      if (response.ok) {
        const newDocument = await response.json();
        setDocuments(prev => [newDocument, ...prev]);
        return newDocument;
      } else {
        throw new Error('Ошибка создания документа');
      }
    } catch (err) {
      setError('Ошибка создания документа');
      console.error('Error creating document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadDocumentFile = async (documentId: string, file: File) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/documents/${documentId}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const updatedDocument = await response.json();
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId ? updatedDocument : doc
        ));
        return updatedDocument;
      } else {
        throw new Error('Ошибка загрузки файла');
      }
    } catch (err) {
      setError('Ошибка загрузки файла');
      console.error('Error uploading file:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadDocumentFile = async (documentId: string, fileName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Ошибка скачивания файла');
      }
    } catch (err) {
      console.error('Error downloading file:', err);
      throw err;
    }
  };

  const approveDocument = async (documentId: string, approverId: string, status: 'approved' | 'rejected', comment?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/documents/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          approverId,
          status,
          comment
        }),
      });

      if (response.ok) {
        const updatedDocument = await response.json();
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId ? updatedDocument : doc
        ));
        return updatedDocument;
      } else {
        throw new Error('Ошибка одобрения документа');
      }
    } catch (err) {
      setError('Ошибка одобрения документа');
      console.error('Error approving document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDocumentsByStatus = useCallback(async (status: DocumentStatus): Promise<Document[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/status/${status}`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (err) {
      console.error('Error getting documents by status:', err);
      return [];
    }
  }, []);

  const getUserDocuments = useCallback(async (userId: string): Promise<Document[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/user/${userId}`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (err) {
      console.error('Error getting user documents:', err);
      return [];
    }
  }, []);

  const deleteDocument = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
      } else {
        throw new Error('Ошибка удаления документа');
      }
    } catch (err) {
      setError('Ошибка удаления документа');
      console.error('Error deleting document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    loading,
    error,
    createDocument,
    uploadDocumentFile,
    downloadDocumentFile,
    approveDocument,
    getDocumentById,
    getDocumentsByStatus,
    getUserDocuments,
    deleteDocument,
    refreshDocuments: loadDocuments
  };
};
