import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:7071/api';

export interface NotificationEvent {
  type: 'document_uploaded' | 'document_approved' | 'document_rejected' | 'user_added';
  userId: string;
  data: any;
  timestamp: string;
}

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signalRConnection, setSignalRConnection] = useState<any>(null);

  // Инициализация SignalR подключения
  useEffect(() => {
    if (userId) {
      initializeSignalR();
    }

    return () => {
      if (signalRConnection) {
        signalRConnection.stop();
      }
    };
  }, [userId]);

  const initializeSignalR = useCallback(async () => {
    try {
      // Получить URL для подключения к SignalR
      const response = await fetch(`${API_BASE_URL}/notifications/signalr-url?userId=${userId}`);
      if (response.ok) {
        const { url } = await response.json();
        
        // Здесь можно использовать @microsoft/signalr для подключения
        // Для простоты пока используем WebSocket
        const connection = new WebSocket(url.replace('https', 'wss'));
        
        connection.onmessage = (event) => {
          const notification = JSON.parse(event.data);
          setNotifications(prev => [notification, ...prev]);
        };

        connection.onerror = (error) => {
          console.error('SignalR connection error:', error);
          setError('Ошибка подключения к уведомлениям');
        };

        setSignalRConnection(connection);
      }
    } catch (err) {
      console.error('Error initializing SignalR:', err);
      setError('Ошибка инициализации уведомлений');
    }
  }, [userId]);

  const sendDocumentUploadNotification = async (documentId: string, authorId: string, approverId: string, title: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/document-uploaded`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          authorId,
          approverId,
          title
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки уведомления');
      }
    } catch (err) {
      console.error('Error sending document upload notification:', err);
      throw err;
    }
  };

  const sendDocumentApprovalNotification = async (
    documentId: string, 
    authorId: string, 
    approverId: string, 
    title: string, 
    status: 'approved' | 'rejected'
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/document-approved`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          authorId,
          approverId,
          title,
          status
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки уведомления');
      }
    } catch (err) {
      console.error('Error sending document approval notification:', err);
      throw err;
    }
  };

  const sendUserAddedNotification = async (newUserId: string, userData: any, addedBy: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/user-added`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: newUserId,
          userData,
          addedBy
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки уведомления');
      }
    } catch (err) {
      console.error('Error sending user added notification:', err);
      throw err;
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  return {
    notifications,
    loading,
    error,
    sendDocumentUploadNotification,
    sendDocumentApprovalNotification,
    sendUserAddedNotification,
    clearNotifications,
    markAsRead
  };
};
