import React, { useState } from 'react';
import { 
  Textarea, 
  Button, 
  Card, 
  Avatar, 
  Subtitle2, 
  Body2, 
  Caption1 
} from '@fluentui/react-components';
import { SendRegular } from '@fluentui/react-icons';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
}

interface DocumentChatProps {
  documentName?: string;
}

export const DocumentChat: React.FC<DocumentChatProps> = ({ documentName }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Документ готов к рассмотрению",
      sender: "System",
      timestamp: new Date(Date.now() - 3600000) // 1 час назад
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const sendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputValue,
        sender: 'You',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 400 }}>
      {/* Заголовок чата */}
      <div style={{ padding: '12px 0', borderBottom: '1px solid #e1dfdd' }}>
        <Subtitle2>Document chat</Subtitle2>
        {documentName && (
          <Body2 style={{ color: '#666', marginTop: 4 }}>
            {documentName}
          </Body2>
        )}
      </div>

      {/* История сообщений */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        padding: '12px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        {messages.map(msg => (
          <Card 
            key={msg.id} 
            style={{ 
              padding: 12,
              maxWidth: '85%',
              alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'You' ? '#0078d4' : '#f3f2f1',
              color: msg.sender === 'You' ? 'white' : 'inherit'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Avatar size={24}>
                {msg.sender === 'System' ? 'S' : msg.sender[0]}
              </Avatar>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  marginBottom: 4 
                }}>
                  <Body2 style={{ 
                    fontWeight: 500,
                    color: msg.sender === 'You' ? 'white' : 'inherit'
                  }}>
                    {msg.sender}
                  </Body2>
                  <Caption1 style={{ 
                    color: msg.sender === 'You' ? 'rgba(255,255,255,0.8)' : '#666'
                  }}>
                    {msg.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Caption1>
                </div>
                <Body2 style={{ 
                  color: msg.sender === 'You' ? 'white' : 'inherit',
                  wordBreak: 'break-word'
                }}>
                  {msg.text}
                </Body2>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Поле ввода */}
      <div style={{ 
        display: 'flex', 
        gap: 8, 
        padding: '12px 0',
        borderTop: '1px solid #e1dfdd'
      }}>
        <Textarea 
          value={inputValue}
          onChange={(_, data) => setInputValue(data.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{ flex: 1 }}
          resize="none"
          rows={2}
        />
        <Button 
          appearance="primary" 
          onClick={sendMessage}
          disabled={!inputValue.trim()}
          icon={<SendRegular />}
        >
          Send
        </Button>
      </div>
    </div>
  );
}; 