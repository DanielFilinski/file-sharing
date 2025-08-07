import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { makeStyles, tokens, Button, Badge } from '@fluentui/react-components';
import { ChevronLeftRegular, ChevronRightRegular } from '@fluentui/react-icons';

// Настройка worker для PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  onTextSelect?: (text: string, page: number, coordinates: any) => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url, onTextSelect }) => {
  const styles = useStyles();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== '' && onTextSelect) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      onTextSelect(selection.toString(), pageNumber, {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.pageControls}>
          <Button
            appearance="outline"
            icon={<ChevronLeftRegular />}
            onClick={previousPage}
            disabled={pageNumber <= 1}
          >
            Предыдущая
          </Button>
          <Badge appearance="filled" color="brand">
            Страница {pageNumber} из {numPages}
          </Badge>
          <Button
            appearance="outline"
            icon={<ChevronRightRegular />}
            onClick={nextPage}
            disabled={pageNumber >= numPages}
          >
            Следующая
          </Button>
        </div>
        <div className={styles.zoomControls}>
          <Button
            appearance="outline"
            onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
          >
            -
          </Button>
          <Badge appearance="outline">
            {Math.round(scale * 100)}%
          </Badge>
          <Button
            appearance="outline"
            onClick={() => setScale(prev => Math.min(3, prev + 0.1))}
          >
            +
          </Button>
        </div>
      </div>

      <div className={styles.pdfContainer} onMouseUp={handleTextSelection}>
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          className={styles.document}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            className={styles.page}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
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
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacingHorizontalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2
  },
  pageControls: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  zoomControls: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  pdfContainer: {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    padding: tokens.spacingHorizontalM
  },
  document: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  page: {
    boxShadow: tokens.shadow8,
    marginBottom: tokens.spacingVerticalM,
    '& canvas': {
      maxWidth: '100%',
      height: 'auto'
    }
  }
}); 