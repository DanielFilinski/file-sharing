import React, { useState, useEffect } from 'react';
import { makeStyles, tokens, Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody, Badge, Text, Divider, Title2, Body1, Subtitle2, Body2 } from '@fluentui/react-components';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Toolbar } from '../components/Toolbar';
import { DocumentsTable } from '../components/DocumentsTable';
import { useFavorites } from '@/features/favorites';
import { useLocation } from 'react-router-dom';
import { Document20Regular, Person20Regular, Chat20Regular, Document24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground2,
    fontFamily: tokens.fontFamilyBase,
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
    width: '100%',
    position: 'relative',
    minHeight: 0
  }
});

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
}

export interface BaseDocumentsPageProps {
  initialDocuments?: Document[];
  showAccessControl?: boolean;
  customToolbarProps?: any;
  customTableProps?: any;
}

export default function BaseDocumentsPage({
  initialDocuments = [],
  showAccessControl = false,
  customToolbarProps = {},
  customTableProps = {}
}: BaseDocumentsPageProps) {
  const styles = useStyles();
  const location = useLocation();
  const { getFavorites } = useFavorites();
  
  // Определяем тип страницы на основе пути
  const getPageType = (): 'firm' | 'client' => {
    if (location.pathname.includes('/client') || location.pathname.includes('/client-side')) {
      return 'client';
    }
    return 'firm';
  };
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [documents, setDocuments] = useState<Document[]>(initialDocuments.length > 0 ? initialDocuments : [
    { key: '1', name: 'Project Proposal.docx', modified: '2 days ago', createdBy: 'John Smith', modifiedBy: 'Jane Doe', owner: 'me', shared: false, status: 'Active', lock: false },
    { key: '2', name: 'Meeting Notes.docx', modified: '1 week ago', createdBy: 'Alice Johnson', modifiedBy: 'Bob Wilson', owner: 'me', shared: true, status: 'Active', lock: false },
    { key: '3', name: 'Budget Report.xlsx', modified: '3 days ago', createdBy: 'Mike Brown', modifiedBy: 'Sarah Davis', owner: 'me', shared: false, status: 'Active', lock: false },
    { key: '4', name: 'Team Guidelines.pdf', modified: '5 days ago', createdBy: 'Emma Wilson', modifiedBy: 'Tom Clark', owner: 'other', shared: true, status: 'Active', lock: false },
    { key: '5', name: 'Design Mockups.pptx', modified: '1 day ago', createdBy: 'Lisa Anderson', modifiedBy: 'David Lee', owner: 'me', shared: false, status: 'Active', lock: false },
    { key: '6', name: 'Design Mockups.pptx', modified: '1 day ago', createdBy: 'Lisa Anderson', modifiedBy: 'David Lee', owner: 'other', shared: true, status: 'Active', lock: false },
    { key: '7', name: 'Design Mockups.pptx', modified: '1 day ago', createdBy: 'Lisa Anderson', modifiedBy: 'David Lee', owner: 'me', shared: false, status: 'Active', lock: false },
  ]);
  const [isGridView, setIsGridView] = useState(false);
  const [documentFilter, setDocumentFilter] = useState<'All Documents' | 'My Documents' | 'Shared Documents' | 'Recent' | 'Favorites'>('All Documents');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAddItem = (type: 'document' | 'spreadsheet' | 'presentation' | 'form') => {
    const ext = {
      document: 'docx',
      spreadsheet: 'xlsx',
      presentation: 'pptx',
      form: 'form'
    }[type] || 'docx';
    setDocuments(prev => [
      ...prev,
      {
        key: (Math.random() * 100000).toFixed(0),
        name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}.${ext}`,
        modified: 'just now',
        createdBy: 'You',
        modifiedBy: 'You',
        owner: 'me',
        shared: false,
        status: 'Active',
        lock: false
      }
    ]);
  };

  const handleFilterChange = (filter: 'All Documents' | 'My Documents' | 'Shared Documents' | 'Recent' | 'Favorites') => {
    setDocumentFilter(filter);
    setSelectedItems(new Set());
  };

  const handleUploadFiles = (files: FileList) => {
    const newDocs = Array.from(files).map(file => ({
      key: (Math.random() * 100000).toFixed(0),
      name: file.name,
      modified: 'just now',
      createdBy: 'You',
      modifiedBy: 'You',
      owner: 'me' as const,
      shared: false,
      status: 'Active',
      lock: false
    }));
    setDocuments(prev => [...prev, ...newDocs]);
  };

  const handleCloseAccess = (documentKey: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.key === documentKey 
        ? { ...doc, shared: false, status: 'Access Closed', lock: false }
        : doc
    ));
  };

  const handleToggleLock = (documentKey: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.key === documentKey 
        ? { ...doc, lock: !doc.lock }
        : doc
    ));
  };

  const handleRowClick = (doc: Document) => {
    setSelectedDoc(doc);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    // setSelectedDoc(null);
  };

  let filteredDocuments = documents;
  if (documentFilter === 'My Documents') filteredDocuments = documents.filter(d => d.owner === 'me');
  if (documentFilter === 'Shared Documents') filteredDocuments = documents.filter(d => d.shared);
  if (documentFilter === 'Recent') filteredDocuments = documents.slice(-3);
  if (documentFilter === 'Favorites') {
    const favoriteKeys = getFavorites();
    filteredDocuments = documents.filter(d => favoriteKeys.includes(d.key));
  }

  useEffect(() => {
    if (location.pathname === '/favorites') {
      setDocumentFilter('Favorites');
    } else {
      setDocumentFilter('All Documents');
    }
  }, [location.pathname]);

  return (
    <div className={styles.root} style={isDrawerOpen ? { marginRight: 400 } : {}}>
      <div className={styles.content}>
        <Toolbar 
          selectedCount={selectedItems.size} 
          onAddItem={handleAddItem} 
          isGridView={isGridView} 
          setIsGridView={setIsGridView} 
          documentFilter={documentFilter} 
          onFilterChange={handleFilterChange} 
          onUploadFiles={handleUploadFiles}
          {...customToolbarProps}
        />
        <Breadcrumbs /> 
        <DocumentsTable 
          items={filteredDocuments} 
          selectedItems={selectedItems} 
          setSelectedItems={setSelectedItems} 
          isGridView={isGridView}
          showAccessControl={showAccessControl}
          onCloseAccess={handleCloseAccess}
          onToggleLock={handleToggleLock}
          pageType={getPageType()}
          onRowClick={handleRowClick}
          {...customTableProps}
        />
      </div>
      <Drawer
        open={isDrawerOpen}
        position="end"
        size="medium"
        modalType="non-modal"
        onOpenChange={(_, data) => {
          setIsDrawerOpen(data.open);
          
        }}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <button onClick={handleDrawerClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }} aria-label="Close">✕</button>
            }
          >
           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* <Document24Regular style={{ fontSize: 32 }} /> */}
              <Title2>{selectedDoc?.name}</Title2>
              <Badge appearance="filled" color={selectedDoc?.status === 'Active' ? 'brand' : 'danger'}>
                {selectedDoc?.status}
              </Badge>
            </div>
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
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
            <Divider />
            <div>
              <Subtitle2>Document chat:</Subtitle2>
              <div style={{ marginTop: 8, padding: 12, background: '#f3f2f1', borderRadius: 8, minHeight: 60, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Chat20Regular />
                <Body2 style={{ color: '#888' }}>Chat for this document will appear here</Body2>
              </div>
            </div>
          </div>
        </DrawerBody>
      </Drawer>
    </div>
  );
} 