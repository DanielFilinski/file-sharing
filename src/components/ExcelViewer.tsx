import React, { useState, useEffect } from 'react';
import { makeStyles, tokens, Badge, Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell } from '@fluentui/react-components';

interface ExcelViewerProps {
  url: string;
  onTextSelect?: (text: string, coordinates: any) => void;
}

interface ExcelData {
  headers: string[];
  rows: string[][];
}

export const ExcelViewer: React.FC<ExcelViewerProps> = ({ url, onTextSelect }) => {
  const styles = useStyles();
  const [data, setData] = useState<ExcelData>({ headers: [], rows: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [activeSheet, setActiveSheet] = useState(0);

  useEffect(() => {
    // Здесь будет логика загрузки Excel документа
    // Для демонстрации используем заглушку
    setData({
      headers: ['ID', 'Имя', 'Email', 'Отдел', 'Статус'],
      rows: [
        ['1', 'Иван Петров', 'ivan@example.com', 'IT', 'Активен'],
        ['2', 'Мария Сидорова', 'maria@example.com', 'HR', 'Активен'],
        ['3', 'Алексей Козлов', 'alex@example.com', 'Финансы', 'Неактивен'],
        ['4', 'Елена Волкова', 'elena@example.com', 'Маркетинг', 'Активен'],
        ['5', 'Дмитрий Соколов', 'dmitry@example.com', 'IT', 'Активен'],
      ]
    });
    setIsLoading(false);
  }, [url]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== '' && onTextSelect) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      onTextSelect(selection.toString(), {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Badge appearance="filled" color="brand">
            Загрузка таблицы...
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Badge appearance="filled" color="brand">
          Excel документ
        </Badge>
        <span>Выделите ячейку или текст для создания комментария</span>
      </div>
      
      <div className={styles.content} onMouseUp={handleTextSelection}>
        <Table className={styles.table}>
          <TableHeader>
            <TableRow>
              {data.headers.map((header, index) => (
                <TableHeaderCell key={index}>
                  {header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingHorizontalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: tokens.spacingHorizontalM
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    '& th, & td': {
      border: `1px solid ${tokens.colorNeutralStroke1}`,
      padding: tokens.spacingHorizontalS,
      textAlign: 'left'
    },
    '& th': {
      backgroundColor: tokens.colorNeutralBackground2,
      fontWeight: 'bold'
    },
    '& tr:nth-child(even)': {
      backgroundColor: tokens.colorNeutralBackground1
    },
    '& tr:hover': {
      backgroundColor: tokens.colorNeutralBackground3
    }
  }
}); 