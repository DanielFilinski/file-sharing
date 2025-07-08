import React from 'react';
import { 
  makeStyles, 
  tokens, 
  Text,
  Card,
  CardHeader,
  CardPreview
} from '@fluentui/react-components';
import { PeopleRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '24px'
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  card: {
    padding: '16px'
  }
});

export const Leads: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.title}>Leads Management</Text>
        <Text className={styles.subtitle}>Manage and track potential clients and leads</Text>
      </div>
      
      <div className={styles.content}>
        <Card className={styles.card}>
          <CardHeader
            image={<PeopleRegular />}
            header={<Text weight="semibold">Leads Overview</Text>}
          />
          <CardPreview>
            <Text>This page will contain leads management functionality.</Text>
          </CardPreview>
        </Card>
      </div>
    </div>
  );
}; 