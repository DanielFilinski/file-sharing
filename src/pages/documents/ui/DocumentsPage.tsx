import React, { useState } from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Toolbar } from '../components/Toolbar';
import { DocumentsTable } from '../components/DocumentsTable';

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

export default function DocumentsPage() {
  const styles = useStyles();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [documents, setDocuments] = useState([
    { key: '1', name: 'Project Proposal.docx', modified: '2 days ago', createdBy: 'John Smith', modifiedBy: 'Jane Doe', owner: 'me', shared: false },
    { key: '2', name: 'Meeting Notes.docx', modified: '1 week ago', createdBy: 'Alice Johnson', modifiedBy: 'Bob Wilson', owner: 'me', shared: true },
    { key: '3', name: 'Budget Report.xlsx', modified: '3 days ago', createdBy: 'Mike Brown', modifiedBy: 'Sarah Davis', owner: 'me', shared: false },
    { key: '4', name: 'Team Guidelines.pdf', modified: '5 days ago', createdBy: 'Emma Wilson', modifiedBy: 'Tom Clark', owner: 'other', shared: true },
    { key: '5', name: 'Design Mockups.pptx', modified: '1 day ago', createdBy: 'Lisa Anderson', modifiedBy: 'David Lee', owner: 'me', shared: false },
    { key: '6', name: 'Design Mockups.pptx', modified: '1 day ago', createdBy: 'Lisa Anderson', modifiedBy: 'David Lee', owner: 'other', shared: true },
    { key: '7', name: 'Design Mockups.pptx', modified: '1 day ago', createdBy: 'Lisa Anderson', modifiedBy: 'David Lee', owner: 'me', shared: false },
  ]);
  const [isGridView, setIsGridView] = useState(false);
  const [documentFilter, setDocumentFilter] = useState<'All Documents' | 'My Documents' | 'Shared Documents' | 'Recent'>('All Documents');

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
        shared: false
      }
    ]);
  };

  const handleFilterChange = (filter: 'All Documents' | 'My Documents' | 'Shared Documents' | 'Recent') => {
    setDocumentFilter(filter);
    setSelectedItems(new Set());
  };

  let filteredDocuments = documents;
  if (documentFilter === 'My Documents') filteredDocuments = documents.filter(d => d.owner === 'me');
  if (documentFilter === 'Shared Documents') filteredDocuments = documents.filter(d => d.shared);
  if (documentFilter === 'Recent') filteredDocuments = documents.slice(-3);

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Toolbar selectedCount={selectedItems.size} onAddItem={handleAddItem} isGridView={isGridView} setIsGridView={setIsGridView} documentFilter={documentFilter} onFilterChange={handleFilterChange} />
        <Breadcrumbs /> 
        <DocumentsTable items={filteredDocuments} selectedItems={selectedItems} setSelectedItems={setSelectedItems} isGridView={isGridView} />
      </div>
    </div>
  );
}
