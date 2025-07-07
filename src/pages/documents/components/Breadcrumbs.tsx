import React from 'react';
import { makeStyles, tokens, Breadcrumb, BreadcrumbItem, Text } from '@fluentui/react-components';
import { ChevronRightRegular } from '@fluentui/react-icons';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles({
  breadcrumbContainer: {
    padding: '12px 24px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    '@media (max-width: 768px)': {
      padding: '8px 16px'
    }
  }
});

export const Breadcrumbs: React.FC = () => {
  const styles = useStyles();
  const location = useLocation();

  const getBreadcrumbItems = () => {
    if (location.pathname === '/favorites') {
      return [
        { key: 'home', text: 'Home' },
        { key: 'documents', text: 'Documents' },
        { key: 'current', text: 'Favorites' }
      ];
    }
    
    return [
      { key: 'home', text: 'Home' },
      { key: 'documents', text: 'Documents' },
      { key: 'current', text: 'My Files' }
    ];
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className={styles.breadcrumbContainer}>
      <Breadcrumb>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.key}>
            <BreadcrumbItem>
              <Text size={300}>{item.text}</Text>
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <ChevronRightRegular fontSize={16} />
            )}
          </React.Fragment>
        ))}
      </Breadcrumb>
    </div>
  );
};