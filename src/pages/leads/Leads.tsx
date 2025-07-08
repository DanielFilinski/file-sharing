import React from 'react';
import { 
  makeStyles, 
  tokens, 
  Text,
  Card,
  CardHeader,
  CardPreview,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge
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
  },
  table: {
    marginTop: '16px'
  }
});

// Моковые данные для демонстрации
const mockLeads = [
  {
    id: 1,
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    firmName: 'Tech Solutions Inc.',
    status: 'Proposal Sent'
  },
  {
    id: 2,
    email: 'jane.smith@enterprise.com',
    phone: '+1 (555) 987-6543',
    firmName: 'Enterprise Corp',
    status: 'Proposal Accepted'
  },
  {
    id: 3,
    email: 'mike.johnson@startup.com',
    phone: '+1 (555) 456-7890',
    firmName: 'Startup Ventures',
    status: 'Proposal Denied'
  },
  {
    id: 4,
    email: 'sarah.wilson@consulting.com',
    phone: '+1 (555) 789-0123',
    firmName: 'Consulting Group',
    status: 'Proposal not Sent'
  }
];

const getStatusAppearance = (status: string): 'filled' | 'outline' | 'ghost' | 'tint' => {
  switch (status) {
    case 'Proposal Sent':
      return 'filled';
    case 'Proposal Accepted':
      return 'filled';
    case 'Proposal Denied':
      return 'filled';
    case 'Proposal not Sent':
      return 'filled';
    default:
      return 'filled';
  }
};

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
            <Table className={styles.table}>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Phone</TableHeaderCell>
                  <TableHeaderCell>Firm Name</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.firmName}</TableCell>
                    <TableCell>
                      <Badge appearance={getStatusAppearance(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardPreview>
        </Card>
      </div>
    </div>
  );
}; 