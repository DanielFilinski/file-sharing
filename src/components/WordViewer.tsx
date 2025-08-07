import React, { useState, useEffect } from 'react';
import { makeStyles, tokens, Badge } from '@fluentui/react-components';

interface WordViewerProps {
  url: string;
  onTextSelect?: (text: string, coordinates: any) => void;
}

export const WordViewer: React.FC<WordViewerProps> = ({ url, onTextSelect }) => {
  const styles = useStyles();
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Здесь будет логика загрузки Word документа
    // Для демонстрации используем заглушку
    setContent(`
      <div style="max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6;">
        <h1>Документ Word</h1>
        <p>Это демонстрационный контент Word документа. В реальном приложении здесь будет отображаться содержимое .docx файла.</p>
        <p>Для работы с Word документами можно использовать библиотеки:</p>
        <ul>
          <li>mammoth.js - для конвертации .docx в HTML</li>
          <li>docx.js - для работы с .docx файлами</li>
          <li>Office Open XML SDK</li>
        </ul>
        <h2>Пример заголовка</h2>
        <p>Этот текст можно выделить для создания комментария. Просто выделите любую часть текста и нажмите кнопку "Выделить текст" в панели инструментов.</p>
        <p>Выделенный текст будет связан с комментарием в чате документа.</p>
      </div>
    `);
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
            Загрузка документа...
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content} onMouseUp={handleTextSelection}>
        <div 
          className={styles.documentContent}
          dangerouslySetInnerHTML={{ __html: content }}
        />
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
  documentContent: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
    '& h1, & h2, & h3': {
      color: tokens.colorNeutralForeground1,
      marginTop: tokens.spacingVerticalL,
      marginBottom: tokens.spacingVerticalM
    },
    '& p': {
      marginBottom: tokens.spacingVerticalM,
      lineHeight: tokens.lineHeightBase400
    },
    '& ul, & ol': {
      marginBottom: tokens.spacingVerticalM,
      paddingLeft: tokens.spacingHorizontalL
    },
    '& li': {
      marginBottom: tokens.spacingVerticalXS
    }
  }
}); 