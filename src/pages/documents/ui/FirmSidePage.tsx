import React from 'react';
import BaseDocumentsPage, { Document } from './BaseDocumentsPage';

// Специфичные документы для фирменной страницы с расширенными правами
const firmDocuments: Document[] = [
  { key: '1', name: 'Project Proposal.docx', modified: '2 days ago', createdBy: 'John Smith', modifiedBy: 'Jane Doe', owner: 'me', shared: false, status: 'Active' },
  { key: '2', name: 'Meeting Notes.docx', modified: '1 week ago', createdBy: 'Alice Johnson', modifiedBy: 'Bob Wilson', owner: 'me', shared: true, status: 'Active' },
  { key: '3', name: 'Budget Report.xlsx', modified: '3 days ago', createdBy: 'Mike Brown', modifiedBy: 'Sarah Davis', owner: 'me', shared: false, status: 'Active' },
  { key: '4', name: 'Team Guidelines.pdf', modified: '5 days ago', createdBy: 'Emma Wilson', modifiedBy: 'Tom Clark', owner: 'other', shared: true, status: 'Active' },
  { key: '5', name: 'Design Mockups.pptx', modified: '1 day ago', createdBy: 'Lisa Anderson', modifiedBy: 'David Lee', owner: 'me', shared: false, status: 'Active' },
  { key: '6', name: 'Design Mockups.pptx', modified: '1 day ago', createdBy: 'Lisa Anderson', modifiedBy: 'David Lee', owner: 'other', shared: true, status: 'Active' },
  { key: '7', name: 'Design Mockups.pptx', modified: '1 day ago', createdBy: 'Lisa Anderson', modifiedBy: 'David Lee', owner: 'me', shared: false, status: 'Active' },
];

export default function FirmSidePage() {
  return (
    <BaseDocumentsPage 
      initialDocuments={firmDocuments}
      showAccessControl={true}
      customToolbarProps={{
        showBulkActions: true,
        showAdvancedFilters: true,
      }}
      customTableProps={{
        showAccessControl: true,
        showBulkSelection: true,
        showAdvancedColumns: true,
      }}
    />
  );
}
