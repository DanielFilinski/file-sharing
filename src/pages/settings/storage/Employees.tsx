import React, { useState } from 'react';
import {
  Button,
  Input,
  Label,
  Dropdown,
  Option,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Tab,
  TabList,
  Card,
  CardHeader,
  CardPreview,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHeaderCell,
  TableCellLayout,
  Avatar,
  Text,
  Textarea,
  Field,
  makeStyles,
  tokens,
  Caption1,
  Body1,
  Subtitle2,
  Title3,
  mergeClasses
} from '@fluentui/react-components';
import {
  PersonAdd20Regular,
  BuildingMultiple20Regular,
  ArrowDownload20Regular,
  Add20Regular,
  Save20Regular,
  Delete20Regular,
  Edit20Regular,
  Settings20Regular,
  People20Regular,
  Person20Regular,
  Folder20Regular
} from '@fluentui/react-icons';
import { useTheme } from '@/app/theme/ThemeProvider';


export const FirmUser = () => {
  const styles = useStyles();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('employees');
  const [showAddEmployeeDialog, setShowAddEmployeeDialog] = useState(false);
  const [showAddClientDialog, setShowAddClientDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false);

  // Sample data
  const [employees, setEmployees] = useState([
    { id: 1, firstName: 'John', lastName: 'Smith', classification: 'Manager', office: 'New York', role: 'Operations Manager', department: 'Operations' },
    { id: 2, firstName: 'Sarah', lastName: 'Johnson', classification: 'Senior', office: 'Chicago', role: 'Senior Analyst', department: 'Finance' },
    { id: 3, firstName: 'Mike', lastName: 'Davis', classification: 'Associate', office: 'Los Angeles', role: 'Developer', department: 'IT' }
  ]);

  const [clients, setClients] = useState([
    { id: 1, firstName: 'Robert', lastName: 'Wilson', phone: '(555) 123-4567', email: 'robert.wilson@example.com', firmName: 'Wilson & Associates', firmAddress: '123 Main St, Boston, MA' },
    { id: 2, firstName: 'Lisa', lastName: 'Anderson', phone: '(555) 987-6543', email: 'lisa.anderson@techcorp.com', firmName: 'TechCorp Inc.', firmAddress: '456 Tech Ave, Seattle, WA' }
  ]);

  const AddEmployeeDialog = () => (
    <Dialog open={showAddEmployeeDialog} onOpenChange={(event, data) => setShowAddEmployeeDialog(data.open)}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <div className={styles.formGrid}>
              <Field label="First Name" required>
                <Input placeholder="Enter first name" />
              </Field>
              <Field label="Last Name" required>
                <Input placeholder="Enter last name" />
              </Field>
            </div>
            <Field label="Classification" required>
              <Dropdown placeholder="Select classification">
                <Option>Manager</Option>
                <Option>Senior</Option>
                <Option>Associate</Option>
                <Option>Junior</Option>
              </Dropdown>
            </Field>
            <Field label="Affiliated Office" required>
              <Dropdown placeholder="Select office">
                <Option>New York</Option>
                <Option>Chicago</Option>
                <Option>Los Angeles</Option>
                <Option>Boston</Option>
              </Dropdown>
            </Field>
            <Field label="Role">
              <Input placeholder="Enter role" />
            </Field>
            <Field label="Department">
              <Dropdown placeholder="Select department">
                <Option>Operations</Option>
                <Option>Finance</Option>
                <Option>IT</Option>
                <Option>HR</Option>
              </Dropdown>
            </Field>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
            <Button appearance="primary" className={styles.brandButton}>Add Employee</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );

  const AddClientDialog = () => (
    <Dialog open={showAddClientDialog} onOpenChange={(event, data) => setShowAddClientDialog(data.open)}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <div className={styles.formGrid}>
              <Field label="First Name" required>
                <Input placeholder="Enter first name" />
              </Field>
              <Field label="Last Name" required>
                <Input placeholder="Enter last name" />
              </Field>
            </div>
            <Field label="Phone Number" required>
              <Input type="tel" placeholder="Enter phone number" />
            </Field>
            <Field label="Email" required>
              <Input type="email" placeholder="Enter email address" />
            </Field>
            <Field label="Firm Name">
              <Input placeholder="Enter firm name" />
            </Field>
            <Field label="Firm Address">
              <Textarea placeholder="Enter firm address" rows={2} />
            </Field>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
            <Button appearance="primary" className={styles.brandButton}>Add Client</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );

  const ImportDialog = () => (
    <Dialog open={showImportDialog} onOpenChange={(event, data) => setShowImportDialog(data.open)}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Import Users</DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <div className={styles.uploadArea}>
              <Folder20Regular />
              <Body1>Drop your Excel file here or click to browse</Body1>
              <Button appearance="transparent" className={styles.brandText}>
                Choose file
              </Button>
              <Caption1>Supported formats: .xlsx, .xls</Caption1>
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
            <Button appearance="primary" className={styles.brandButton}>Import</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );

  const DepartmentDialog = () => (
    <Dialog open={showDepartmentDialog} onOpenChange={(event, data) => setShowDepartmentDialog(data.open)}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Add Department</DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <Field label="Department Name" required>
              <Input placeholder="Enter department name" />
            </Field>
            <Field label="Description">
              <Textarea placeholder="Enter description" rows={3} />
            </Field>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
            <Button appearance="primary" className={styles.brandButton}>Add Department</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Settings20Regular className={styles.brandText} />
          <Title3>User Settings</Title3>
        </div>
        <Button 
          appearance="primary" 
          icon={<Save20Regular />}
          className={styles.brandButton}
        >
          Save changes
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          {/* Tab Navigation */}
          <div className={styles.tabContainer}>
            <TabList 
              selectedValue={activeTab} 
              onTabSelect={(event, data) => setActiveTab(data.value?.toString() || 'employees')}
            >
              <Tab value="employees" icon={<People20Regular />}>
                Employees
              </Tab>
              <Tab value="clients" icon={<Person20Regular />}>
                Clients
              </Tab>
            </TabList>
          </div>

            {/* Employees Tab */}
            {activeTab === 'employees' && (
              <Card className={styles.card}>
                <div className={styles.cardHeader}>
                  <Subtitle2>Employees</Subtitle2>
                  <div className={styles.actionButtons}>
                    <Button
                      appearance="subtle"
                      icon={<BuildingMultiple20Regular />}
                      onClick={() => setShowDepartmentDialog(true)}
                    >
                      Add Department
                    </Button>
                    <Button
                      appearance="subtle"
                      icon={<ArrowDownload20Regular />}
                      onClick={() => setShowImportDialog(true)}
                    >
                      Import
                    </Button>
                    <Button
                      appearance="primary"
                      icon={<PersonAdd20Regular />}
                      onClick={() => setShowAddEmployeeDialog(true)}
                      className={styles.brandButton}
                    >
                      Add Employee
                    </Button>
                  </div>
                </div>
                
                <div className={styles.tableContainer}>
                  <Table className={styles.table}>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell className={styles.mobileHidden}>Classification</TableHeaderCell>
                        <TableHeaderCell className={styles.mobileHidden}>Office</TableHeaderCell>
                        <TableHeaderCell>Role</TableHeaderCell>
                        <TableHeaderCell className={styles.mobileHidden}>Department</TableHeaderCell>
                        <TableHeaderCell>Actions</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <TableCellLayout media={
                              <Avatar 
                                name={`${employee.firstName} ${employee.lastName}`}
                                color="brand"
                              />
                            }>
                              <Body1>{employee.firstName} {employee.lastName}</Body1>
                            </TableCellLayout>
                          </TableCell>
                          <TableCell className={styles.mobileHidden}>
                            <Text>{employee.classification}</Text>
                          </TableCell>
                          <TableCell className={styles.mobileHidden}>
                            <Text>{employee.office}</Text>
                          </TableCell>
                          <TableCell>
                            <Text>{employee.role}</Text>
                          </TableCell>
                          <TableCell className={styles.mobileHidden}>
                            <Text>{employee.department}</Text>
                          </TableCell>
                          <TableCell>
                            <div className={styles.actionCell}>
                              <Button
                                appearance="subtle"
                                size="small"
                                icon={<Edit20Regular />}
                                className={styles.brandText}
                              >
                                Edit
                              </Button>
                              <Button
                                appearance="subtle"
                                size="small"
                                icon={<Delete20Regular />}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}

            {/* Clients Tab */}
            {activeTab === 'clients' && (
              <Card className={styles.card}>
                <div className={styles.cardHeader}>
                  <Subtitle2>Clients</Subtitle2>
                  <div className={styles.actionButtons}>
                    <Button
                      appearance="subtle"
                      icon={<ArrowDownload20Regular />}
                      onClick={() => setShowImportDialog(true)}
                    >
                      Import
                    </Button>
                    <Button
                      appearance="primary"
                      icon={<PersonAdd20Regular />}
                      onClick={() => setShowAddClientDialog(true)}
                      className={styles.brandButton}
                    >
                      Add Client
                    </Button>
                  </div>
                </div>
                
                <div className={styles.tableContainer}>
                  <Table className={styles.table}>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell className={styles.mobileHidden}>Phone</TableHeaderCell>
                        <TableHeaderCell>Email</TableHeaderCell>
                        <TableHeaderCell className={styles.mobileHidden}>Firm</TableHeaderCell>
                        <TableHeaderCell>Actions</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <TableCellLayout media={
                              <Avatar 
                                name={`${client.firstName} ${client.lastName}`}
                                color="brand"
                              />
                            }>
                              <Body1>{client.firstName} {client.lastName}</Body1>
                            </TableCellLayout>
                          </TableCell>
                          <TableCell className={styles.mobileHidden}>
                            <Text>{client.phone}</Text>
                          </TableCell>
                          <TableCell>
                            <Text>{client.email}</Text>
                          </TableCell>
                          <TableCell className={styles.mobileHidden}>
                            <div>
                              <Body1>{client.firmName}</Body1>
                              <Caption1>{client.firmAddress}</Caption1>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={styles.actionCell}>
                              <Button
                                appearance="subtle"
                                size="small"
                                icon={<Edit20Regular />}
                                className={styles.brandText}
                              >
                                Edit
                              </Button>
                              <Button
                                appearance="subtle"
                                size="small"
                                icon={<Delete20Regular />}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Dialogs */}
        <AddEmployeeDialog />
        <AddClientDialog />
        <ImportDialog />
        <DepartmentDialog />
      </div>
  );
};


const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
    fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXL}`,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow2,
    minHeight: '60px',
    '@media (max-width: 768px)': {
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
      flexDirection: 'column',
      gap: tokens.spacingVerticalS,
      minHeight: 'auto'
    }
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: `${tokens.spacingVerticalXL} ${tokens.spacingHorizontalXL}`,
    '@media (max-width: 768px)': {
      padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalM}`
    }
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  tabContainer: {
    marginBottom: tokens.spacingVerticalXL
  },
  card: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow2
  },
  cardHeader: {
    padding: `${tokens.spacingVerticalXL} ${tokens.spacingHorizontalXL}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
      flexDirection: 'column',
      gap: tokens.spacingVerticalM,
      alignItems: 'flex-start'
    }
  },
  actionButtons: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    '@media (max-width: 768px)': {
      flexWrap: 'wrap',
      width: '100%'
    }
  },
  table: {
    width: '100%'
  },
  tableContainer: {
    overflowX: 'auto',
    '@media (max-width: 768px)': {
      fontSize: '14px'
    }
  },
  dialogContent: {
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    minWidth: '400px',
    '@media (max-width: 768px)': {
      minWidth: '300px',
      padding: tokens.spacingVerticalM
    }
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingVerticalM,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr'
    }
  },
  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px dashed ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalXL}`,
    textAlign: 'center',
    gap: tokens.spacingVerticalM,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2
    }
  },
  brandButton: {
   
  },
  brandText: {
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  mobileHidden: {
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  actionCell: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: tokens.spacingVerticalXS
    }
  }
});