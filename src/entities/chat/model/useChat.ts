import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:7071/api';

export interface ChatMessage {
  id: string;
  documentId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export const useChat = (documentId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка сообщений при изменении documentId
  useEffect(() => {
    if (documentId) {
      loadMessages();
    }
  }, [documentId]);

  const loadMessages = useCallback(async () => {
    if (!documentId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${documentId}/messages`);
      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);
      } else {
        throw new Error('Ошибка загрузки сообщений');
      }
    } catch (err) {
      setError('Ошибка загрузки сообщений');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  const sendMessage = async (senderId: string, content: string) => {
    if (!content.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          senderId,
          content: content.trim()
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
      } else {
        throw new Error('Ошибка отправки сообщения');
      }
    } catch (err) {
      setError('Ошибка отправки сообщения');
      console.error('Error sending message:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/chat/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
      } else {
        throw new Error('Ошибка удаления сообщения');
      }
    } catch (err) {
      setError('Ошибка удаления сообщения');
      console.error('Error deleting message:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRecentMessages = useCallback(async (limit: number = 50) => {
    if (!documentId) return [];
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${documentId}/messages/recent?limit=${limit}`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (err) {
      console.error('Error getting recent messages:', err);
      return [];
    }
  }, [documentId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage,
    getRecentMessages,
    refreshMessages: loadMessages
  };
};
