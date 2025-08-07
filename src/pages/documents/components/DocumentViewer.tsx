import React, { useState, useRef, useEffect } from 'react';
import { 
  makeStyles, 
  tokens, 
  Button, 
  Badge,
  Divider,
  Subtitle2,
  Body2
} from '@fluentui/react-components';
import { 
  DocumentPdfRegular, 
  DocumentRegular, 
  TableRegular,
  CommentRegular,
  HighlightRegular
} from '@fluentui/react-icons';
import { DocumentFragment } from '@/types/document';
import { PDFViewer } from '@/components/PDFViewer';
import { WordViewer } from '@/components/WordViewer';
import { ExcelViewer } from '@/components/ExcelViewer';

interface DocumentViewerProps {
  document: {
    name: string;
    type: 'pdf' | 'docx' | 'xlsx';
    url: string;
  };
  onFragmentSelect: (fragment: DocumentFragment) => void;
  selectedFragment?: DocumentFragment;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onFragmentSelect,
  selectedFragment
}) => {
  const styles = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectionMode, setSelectionMode] = useState(false);
  const [fragments, setFragments] = useState<DocumentFragment[]>([]);
  const viewerRef = useRef<HTMLDivElement>(null);

  const getDocumentIcon = () => {
    switch (document.type) {
      case 'pdf': return <DocumentPdfRegular />;
      case 'docx': return <DocumentRegular />;
      case 'xlsx': return <TableRegular />;
      default: return <DocumentRegular />;
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const viewerRect = viewerRef.current?.getBoundingClientRect();

    if (viewerRect) {
      const fragment: DocumentFragment = {
        id: `fragment_${Date.now()}`,
        documentId: document.name,
        text: selection.toString(),
        page: currentPage,
        coordinates: {
          x: rect.left - viewerRect.left,
          y: rect.top - viewerRect.top,
          width: rect.width,
          height: rect.height
        },
        createdAt: new Date(),
        createdBy: 'You'
      };

      setFragments(prev => [...prev, fragment]);
      onFragmentSelect(fragment);
      setSelectionMode(false);
    }
  };

  const handleHighlightClick = (fragment: DocumentFragment) => {
    onFragmentSelect(fragment);
  };

  return (
    <div className={styles.container}>
      {/* Заголовок документа */}
      <div className={styles.header}>
        <div className={styles.documentInfo}>
          {getDocumentIcon()}
          <div>
            <Subtitle2>{document.name}</Subtitle2>
            <Body2>Страница {currentPage} из {totalPages}</Body2>
          </div>
        </div>
        <div className={styles.controls}>
          <Button
            appearance={selectionMode ? "primary" : "outline"}
            icon={<HighlightRegular />}
            onClick={() => setSelectionMode(!selectionMode)}
          >
            Выделить текст
          </Button>
          <Badge appearance="filled" color="brand">
            {fragments.length} фрагментов
          </Badge>
        </div>
      </div>

      <Divider />

      {/* Область просмотра документа */}
      <div className={styles.viewerContainer}>
        <div 
          ref={viewerRef}
          className={styles.documentViewer}
          onMouseUp={selectionMode ? handleTextSelection : undefined}
        >
          {/* Отображение документа в зависимости от типа */}
          {document.type === 'pdf' && (
            <PDFViewer 
              url={document.url} 
              onTextSelect={(text, page, coordinates) => {
                const fragment: DocumentFragment = {
                  id: `fragment_${Date.now()}`,
                  documentId: document.name,
                  text: text,
                  page: page,
                  coordinates: coordinates,
                  createdAt: new Date(),
                  createdBy: 'You'
                };
                setFragments(prev => [...prev, fragment]);
                onFragmentSelect(fragment);
              }}
            />
          )}
          
          {document.type === 'docx' && (
            <WordViewer 
              url={document.url} 
              onTextSelect={(text, coordinates) => {
                const fragment: DocumentFragment = {
                  id: `fragment_${Date.now()}`,
                  documentId: document.name,
                  text: text,
                  page: 1,
                  coordinates: coordinates,
                  createdAt: new Date(),
                  createdBy: 'You'
                };
                setFragments(prev => [...prev, fragment]);
                onFragmentSelect(fragment);
              }}
            />
          )}
          
          {document.type === 'xlsx' && (
            <ExcelViewer 
              url={document.url} 
              onTextSelect={(text, coordinates) => {
                const fragment: DocumentFragment = {
                  id: `fragment_${Date.now()}`,
                  documentId: document.name,
                  text: text,
                  page: 1,
                  coordinates: coordinates,
                  createdAt: new Date(),
                  createdBy: 'You'
                };
                setFragments(prev => [...prev, fragment]);
                onFragmentSelect(fragment);
              }}
            />
          )}
          
          {/* Fallback для неизвестных типов */}
          {!['pdf', 'docx', 'xlsx'].includes(document.type) && (
            <div className={styles.documentPlaceholder}>
              <div className={styles.documentContent}>
                <h2>Документ: {document.name}</h2>
                <p>Неподдерживаемый тип документа: {document.type}</p>
                <p>Поддерживаемые форматы: PDF, DOCX, XLSX</p>
              </div>
            </div>
          )}

          {/* Отображение выделенных фрагментов */}
          {fragments.map(fragment => (
            <div
              key={fragment.id}
              className={`${styles.fragmentHighlight} ${
                selectedFragment?.id === fragment.id ? styles.selected : ''
              }`}
              style={{
                left: fragment.coordinates.x,
                top: fragment.coordinates.y,
                width: fragment.coordinates.width,
                height: fragment.coordinates.height
              }}
              onClick={() => handleHighlightClick(fragment)}
            >
              <div className={styles.fragmentTooltip}>
                {fragment.text.substring(0, 50)}...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground1
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`
  },
  documentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  viewerContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden'
  },
  documentViewer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'auto',
    backgroundColor: tokens.colorNeutralBackground1
  },
  documentPlaceholder: {
    padding: tokens.spacingHorizontalXL,
    minHeight: '100%'
  },
  documentContent: {
    maxWidth: '800px',
    margin: '0 auto',
    lineHeight: tokens.lineHeightBase400
  },
  fragmentHighlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 0, 0.3)',
    border: '2px solid #FFD700',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 0, 0.5)',
      borderColor: '#FFA500'
    }
  },
  selected: {
    backgroundColor: 'rgba(0, 123, 255, 0.3)',
    borderColor: '#007BFF'
  },
  fragmentTooltip: {
    position: 'absolute',
    top: '-30px',
    left: '0',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    pointerEvents: 'none',
    '&:hover': {
      opacity: 1
    }
  }
}); 