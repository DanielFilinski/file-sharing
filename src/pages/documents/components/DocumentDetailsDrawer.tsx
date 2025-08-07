import React, { useState } from 'react';
import { 
  Drawer, 
  DrawerHeader, 
  DrawerHeaderTitle, 
  DrawerBody, 
  Badge, 
  Divider, 
  Title2, 
  Body2, 
  Subtitle2 
} from '@fluentui/react-components';
import { Person20Regular } from '@fluentui/react-icons';
import { Document } from '../ui/BaseDocumentsPage';
import { DocumentChat } from './DocumentChat';
import { DocumentViewer } from './DocumentViewer';
import { DocumentFragment } from '@/types/document';

interface DocumentDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDoc: Document | null;
  onClose: () => void;
}

export const DocumentDetailsDrawer: React.FC<DocumentDetailsDrawerProps> = ({
  isOpen,
  onOpenChange,
  selectedDoc,
  onClose
}) => {
  const [selectedFragment, setSelectedFragment] = useState<DocumentFragment | undefined>();
  const [activeTab, setActiveTab] = useState<'info' | 'viewer' | 'chat'>('info');

  const handleFragmentSelect = (fragment: DocumentFragment) => {
    setSelectedFragment(fragment);
    setActiveTab('chat'); // Автоматически переключаемся на чат
  };

  return (
    <Drawer
      open={isOpen}
      position="end"
      size="large"
      modalType="non-modal"
      onOpenChange={(_, data) => {
        onOpenChange(data.open);
      }}
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }} aria-label="Close">✕</button>
          }
        >
         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Title2>{selectedDoc?.name}</Title2>
            <Badge appearance="filled" color={selectedDoc?.status === 'Active' ? 'brand' : 'danger'}>
              {selectedDoc?.status}
            </Badge>
          </div>
        </DrawerHeaderTitle>
      </DrawerHeader>
              <DrawerBody>
          {/* Табы для переключения между информацией, просмотром и чатом */}
          <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: 16 }}>
            <button
              onClick={() => setActiveTab('info')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: activeTab === 'info' ? '#0078d4' : 'transparent',
                color: activeTab === 'info' ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              Информация
            </button>
            <button
              onClick={() => setActiveTab('viewer')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: activeTab === 'viewer' ? '#0078d4' : 'transparent',
                color: activeTab === 'viewer' ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              Просмотр
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: activeTab === 'chat' ? '#0078d4' : 'transparent',
                color: activeTab === 'chat' ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              Чат
            </button>
          </div>

          {activeTab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
              <Divider />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <Subtitle2>Created:</Subtitle2>
                  <Body2 style={{ marginLeft: 8 }}>{selectedDoc?.modified}</Body2>
                </div>
                <div>
                  <Subtitle2>Created by:</Subtitle2>
                  <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Person20Regular /> <Body2>{selectedDoc?.createdBy}</Body2>
                  </span>
                </div>
                <div>
                  <Subtitle2>Last edited by:</Subtitle2>
                  <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Person20Regular /> <Body2>{selectedDoc?.modifiedBy}</Body2>
                  </span>
                </div>
                <div>
                  <Subtitle2>Approved by:</Subtitle2>
                  <span style={{ marginLeft: 8, color: '#888' }}><Body2>—</Body2></span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'viewer' && selectedDoc && (
            <DocumentViewer
              document={{
                name: selectedDoc.name,
                type: selectedDoc.type,
                url: selectedDoc.url || ''
              }}
              onFragmentSelect={handleFragmentSelect}
              selectedFragment={selectedFragment}
            />
          )}

          {activeTab === 'chat' && (
            <DocumentChat 
              documentName={selectedDoc?.name}
              selectedFragment={selectedFragment}
              onFragmentSelect={handleFragmentSelect}
            />
          )}
        </DrawerBody>
    </Drawer>
  );
}; 