import React, { useState } from 'react';
import { 
  makeStyles, 
  tokens, 
  Table, 
  TableHeader, 
  TableRow, 
  TableHeaderCell, 
  TableBody, 
  TableCell, 
  Text,
  Button,
  Menu,
  MenuList,
  MenuItem,
  MenuPopover,
  MenuTrigger
} from '@fluentui/react-components';
import { Document20Regular, DocumentBulletList20Regular, StarRegular, StarFilled } from '@fluentui/react-icons';
import { useFavorites } from '@/features/favorites';

const TABLE_COLUMNS = [
  { key: 'name', name: 'Name' },
  { key: 'modified', name: 'Modified' },
  { key: 'createdBy', name: 'Created by' },
  { key: 'modifiedBy', name: 'Modified by' },
  { key: 'favorite', name: 'Favorite' },
  { key: 'status', name: 'Status' }
];  


export const DocumentsTable: React.FC<{ items: any[], selectedItems: Set<string>, setSelectedItems: (s: Set<string>) => void, isGridView: boolean }> = ({ items, selectedItems, setSelectedItems, isGridView }) => {
  const styles = useStyles();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; itemKey: string } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, itemKey: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, itemKey });
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  // Закрытие контекстного меню при клике вне его
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(items.map(item => item.key)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (itemKey: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemKey);
    } else {
      newSelected.delete(itemKey);
    }
    setSelectedItems(newSelected);
  };

  const handleFavoriteClick = (e: React.MouseEvent, itemKey: string) => {
    e.stopPropagation();
    toggleFavorite(itemKey);
  };

  const isAllSelected = selectedItems.size === items.length;
  const isIndeterminate = selectedItems.size > 0 && selectedItems.size < items.length;

  if (isGridView) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: 16 }}>
        {items.map(item => (
          <div 
            key={item.key} 
            style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, minWidth: 200, maxWidth: 240, background: '#fafafa', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', cursor: 'pointer' }}
            onContextMenu={(e) => handleContextMenu(e, item.key)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontWeight: 600, flex: 1 }}>{item.name}</div>
              <Button
                appearance="transparent"
                icon={isFavorite(item.key) ? <StarFilled style={{ color: '#FFD700' }} /> : <StarRegular />}
                onClick={(e) => handleFavoriteClick(e, item.key)}
                style={{ minWidth: 'auto', padding: '4px' }}
              />
            </div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Modified: {item.modified}</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Created by: {item.createdBy}</div>
            <div style={{ fontSize: 12, color: '#888' }}>Modified by: {item.modifiedBy}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{position: 'relative', height: '100%'}}>
 <div className={styles.tableContainer}>
      <Table className={styles.table}>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>
              <div className={styles.cellContent}>
                <input 
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = isIndeterminate;
                    }
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <Document20Regular />
                <Text weight="semibold">Name</Text>
              </div>
            </TableHeaderCell>
            {TABLE_COLUMNS.slice(1).map(column => (
              <TableHeaderCell key={column.key}>
                <Text weight="semibold">{column.name}</Text>
              </TableHeaderCell>
            ))}
            <TableHeaderCell style={{ width: '50px' }}>
              <Text weight="semibold"></Text>
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow 
              key={item.key}
              onContextMenu={(e) => handleContextMenu(e, item.key)}
              style={{ cursor: 'pointer' }}
            >
              <TableCell>
                <div className={styles.cellContent}>
                  <input 
                    type="checkbox"
                    checked={selectedItems.has(item.key)}
                    onChange={(e) => handleSelectItem(item.key, e.target.checked)}
                  />
                  <DocumentBulletList20Regular />
                  <Text>{item.name}</Text>
                </div>
              </TableCell>
              <TableCell>
                <Text>{item.modified}</Text>
              </TableCell>
              <TableCell>
                <Text>{item.createdBy}</Text>
              </TableCell>
              <TableCell>
                <Text>{item.modifiedBy}</Text>
              </TableCell>
              <TableCell>
                <Button
                  appearance="transparent"
                  icon={isFavorite(item.key) ? <StarFilled style={{ color: '#FFD700' }} /> : <StarRegular />}
                  onClick={(e) => handleFavoriteClick(e, item.key)}
                  style={{ minWidth: 'auto', padding: '4px' }}
                />
              </TableCell>
              <TableCell>
                <Text>{item.status}</Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    
    {/* Контекстное меню */}
    {contextMenu && (
      <div 
        style={{
          position: 'fixed',
          top: contextMenu.y,
          left: contextMenu.x,
          zIndex: 1000,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          padding: '4px 0'
        }}
        onMouseLeave={handleContextMenuClose}
      >
        <div 
          style={{ padding: '8px 16px', cursor: 'pointer' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          onClick={() => { console.log('Delete document', contextMenu.itemKey); handleContextMenuClose(); }}
        >
          Delete
        </div>
        <div 
          style={{ padding: '8px 16px', cursor: 'pointer' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          onClick={() => { console.log('Rename document', contextMenu.itemKey); handleContextMenuClose(); }}
        >
          Rename
        </div>
        <div 
          style={{ padding: '8px 16px', cursor: 'pointer' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          onClick={() => { console.log('Move document', contextMenu.itemKey); handleContextMenuClose(); }}
        >
          Move
        </div>
        <div 
          style={{ padding: '8px 16px', cursor: 'pointer' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          onClick={() => { console.log('Copy document', contextMenu.itemKey); handleContextMenuClose(); }}
        >
          Copy
        </div>
        <div 
          style={{ padding: '8px 16px', cursor: 'pointer' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          onClick={() => { console.log('Download document', contextMenu.itemKey); handleContextMenuClose(); }}
        >
          Download
        </div>
        <div 
          style={{ padding: '8px 16px', cursor: 'pointer' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          onClick={() => { console.log('Print document', contextMenu.itemKey); handleContextMenuClose(); }}
        >
          Print
        </div>
      </div>
    )}
    </div>
  );
}; 

const useStyles = makeStyles({
    tableContainer: {
      flex: 1,
      overflowX: 'auto', // <-- Здесь
      overflowY: 'hidden',
      backgroundColor: tokens.colorNeutralBackground1,
      position: 'absolute',
      top: '0px',
      left: 0,
      right: 0,
      bottom: 0,
      // width: '100%',     
      '&::-webkit-scrollbar': {
        height: '4px',
        width: '4px'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: tokens.colorNeutralStroke2,
        borderRadius: '4px'
      }
    },
    table: {
      width: '100%',
      minWidth: '550px',
      tableLayout: 'fixed',
      '& .fui-TableHeader': {
        backgroundColor: tokens.colorNeutralBackground2,
        position: 'sticky',
        top: 0,
        zIndex: 1
      },
      '& .fui-TableHeaderCell': {
        color: tokens.colorNeutralForeground2,
        fontWeight: tokens.fontWeightSemibold,
        fontSize: tokens.fontSizeBase200,
        padding: '12px 16px',
        height: '44px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      },
      '& .fui-TableRow': {
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        height: '48px',
        ':hover': {
          backgroundColor: tokens.colorSubtleBackgroundHover
        }
      },
      '& .fui-TableCell': {
        padding: '12px 16px',
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    },
    cellContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      '& input[type="checkbox"]': {
        width: '16px',
        height: '16px',
        cursor: 'pointer',
        accentColor: '#9333EA'
      }
    }
  });