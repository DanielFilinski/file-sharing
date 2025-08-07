import React, { useState, useEffect } from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Toolbar } from '../components/Toolbar';
import { DocumentsTable } from '../components/DocumentsTable';
import { DocumentDetailsDrawer } from '../components/DocumentDetailsDrawer';
import { useFavorites } from '@/features/favorites';
import { useLocation } from 'react-router-dom';


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
  type: 'pdf' | 'docx' | 'xlsx';
  url?: string;
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
    { key: '1', name: 'Project Proposal.docx', modified: '2 days ago', createdBy: 'John Smith', modifiedBy: 'Jane Doe', owner: 'me', shared: false, status: 'Active', lock: false, type: 'docx', url: 'https://example.com/proposal.docx' },
    { key: '2', name: 'Meeting Notes.docx', modified: '1 week ago', createdBy: 'Alice Johnson', modifiedBy: 'Bob Wilson', owner: 'me', shared: true, status: 'Active', lock: false, type: 'docx', url: 'https://example.com/notes.docx' },
    { key: '3', name: 'Budget Report.xlsx', modified: '3 days ago', createdBy: 'Mike Brown', modifiedBy: 'Sarah Davis', owner: 'me', shared: false, status: 'Active', lock: false, type: 'xlsx', url: 'https://example.com/budget.xlsx' },
    { key: '4', name: 'Team Guidelines.pdf', modified: '5 days ago', createdBy: 'Emma Wilson', modifiedBy: 'Tom Clark', owner: 'other', shared: true, status: 'Active', lock: false, type: 'pdf', url: 'https://example.com/guidelines.pdf' },
    { key: '5', name: 'Design Mockups.pptx', modified: '1 day ago', createdBy: 'Lisa Anderson', modifiedBy: 'David Lee', owner: 'me', shared: false, status: 'Active', lock: false, type: 'docx', url: 'https://example.com/mockups.pptx' },
    { key: '6', name: 'Design Mockups.pptx', modified: '1 day ago', createdBy: 'Lisa Anderson', modifiedBy: 'David Lee', owner: 'other', shared: true, status: 'Active', lock: false, type: 'docx', url: 'https://example.com/mockups2.pptx' },
    { key: '7', name: 'Design Mockups.pptx', modified: '1 day ago', createdBy: 'Lisa Anderson', modifiedBy: 'David Lee', owner: 'me', shared: false, status: 'Active', lock: false, type: 'docx', url: 'https://example.com/mockups3.pptx' },
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
    
    const docType = {
      document: 'docx',
      spreadsheet: 'xlsx',
      presentation: 'docx',
      form: 'docx'
    }[type] as 'pdf' | 'docx' | 'xlsx';
    
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
        lock: false,
        type: docType,
        url: `https://example.com/new-${type}.${ext}`
      }
    ]);
  };

  const handleFilterChange = (filter: 'All Documents' | 'My Documents' | 'Shared Documents' | 'Recent' | 'Favorites') => {
    setDocumentFilter(filter);
    setSelectedItems(new Set());
  };

  const handleUploadFiles = (files: FileList) => {
    const newDocs = Array.from(files).map(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const type = extension === 'pdf' ? 'pdf' : 
                  extension === 'xlsx' ? 'xlsx' : 'docx';
      
      return {
        key: (Math.random() * 100000).toFixed(0),
        name: file.name,
        modified: 'just now',
        createdBy: 'You',
        modifiedBy: 'You',
        owner: 'me' as const,
        shared: false,
        status: 'Active',
        lock: false,
        type: type as 'pdf' | 'docx' | 'xlsx',
        url: `https://example.com/${file.name}`
      };
    });
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
      <DocumentDetailsDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedDoc={selectedDoc}
        onClose={handleDrawerClose}
      />
    </div>
  );
} 