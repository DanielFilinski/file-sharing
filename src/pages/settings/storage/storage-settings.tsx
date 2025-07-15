import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardPreview,
  Input,
  Label,
  Select,
  Text,
  Title1,
  Title2,
  Title3,
  Body1,
  Body2,
  Caption1,
  tokens,
  makeStyles,
  Badge,
  Avatar,
  Divider,
  Field,
  MessageBar,
  MessageBarTitle,
  MessageBarBody,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  ProgressBar,
  Spinner,
  Toast,
  useToastController,
  Toaster,
  useId,
  RadioGroup,
  Radio,
  Switch,
  Tag,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuButton
} from '@fluentui/react-components';

import {
  CloudAdd24Regular,
  HardDrive24Regular,
  CheckmarkCircle24Filled,
  DismissCircle24Filled,
  Desktop24Regular,
  NetworkAdapter16Regular,
  Clock24Regular,
  Folder24Regular,
  Warning24Filled,
  Add24Regular,
  ChevronDown24Regular,
  ChevronRight24Regular,
  Edit24Regular,
  Save24Regular,
  Delete24Regular,
  FolderAdd24Regular,
  Copy24Regular,
  Settings24Regular,
  MoreHorizontal24Regular
} from '@fluentui/react-icons';
import { useTheme } from '@/app/theme/ThemeProvider';

// Типы
interface Template {
  name: string;
  firmType: string;
  timeStructure: string;
  clientTypes: string[];
  binderStructure: string;
}

interface PreviewStructure {
  "Period Structure": string[];
  "Client Types": string[];
  "Document Organization": Record<string, string[]>;
}

export const StorageSettings = () => {
  const styles = useStyles();
  
  
  // Form states
  const [storageType, setStorageType] = useState('cloud');
  const [sharePointEmail, setSharePointEmail] = useState('');
  const [sharePointPassword, setSharePointPassword] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [storageAmount, setStorageAmount] = useState('');
  const [storageUnit, setStorageUnit] = useState('GB');
  const [retentionPeriod, setRetentionPeriod] = useState('');
  const [retentionUnit, setRetentionUnit] = useState('months');
  const [showNotEnoughSpace, setShowNotEnoughSpace] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  
  // Folder structure states
  const [firmType, setFirmType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customStructure, setCustomStructure] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [timeStructure, setTimeStructure] = useState('tax-year');
  const [clientTypes, setClientTypes] = useState(['Tax Client', 'Audit Client']);
  const [newClientType, setNewClientType] = useState('');
  const [binderStructure, setBinderStructure] = useState('numerical');
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
  const [previewStructure, setPreviewStructure] = useState<PreviewStructure | null>(null);

  const defaultTemplates: Record<string, Template> = {
    accounting: {
      name: "Accounting Firm Template",
      firmType: "accounting",
      timeStructure: "tax-year",
      clientTypes: ["Tax Client", "Audit Client", "Consulting"],
      binderStructure: "numerical"
    },
    legal: {
      name: "Legal Firm Template",
      firmType: "legal",
      timeStructure: "quarterly",
      clientTypes: ["Corporate", "Individual", "Litigation", "Real Estate"],
      binderStructure: "alphabetical"
    },
    consulting: {
      name: "Consulting Firm Template",
      firmType: "consulting",
      timeStructure: "monthly",
      clientTypes: ["Strategy", "Operations", "Technology", "HR"],
      binderStructure: "custom"
    }
  };

  const generatePeriodStructure = (type: string): string[] => {
    switch(type) {
      case 'tax-year':
        return ['Tax Year 2025', 'Tax Year 2024', 'Tax Year 2023'];
      case 'quarterly':
        return ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];
      case 'monthly':
        return ['January 2025', 'February 2025', 'March 2025', 'April 2025'];
      case 'custom-date':
        return ['Custom Period 1', 'Custom Period 2'];
      default:
        return [];
    }
  };

  const generateBinderStructure = (type: string, firmType: string): Record<string, string[]> => {
    if (firmType === 'accounting') {
      if (type === 'numerical') {
        return {
          "1000 - General/Assets": ["1000.01 - Cash", "1000.02 - Accounts Receivable", "1000.03 - Inventory"],
          "2000 - Liabilities": ["2000.01 - Accounts Payable", "2000.02 - Accrued Expenses"],
          "3000 - Equity": ["3000.01 - Owner's Equity", "3000.02 - Retained Earnings"]
        };
      }
    } else if (firmType === 'legal') {
      if (type === 'alphabetical') {
        return {
          "A - Planning Documents": ["A.1 - Initial Consultation", "A.2 - Case Strategy"],
          "B - Deliverables": ["B.1 - Contracts", "B.2 - Court Filings"],
          "C - Research": ["C.1 - Legal Research", "C.2 - Case Law"]
        };
      }
    } else if (firmType === 'consulting') {
      return {
        "01 - Discovery": ["Requirements", "Stakeholder Analysis"],
        "02 - Analysis": ["Current State", "Gap Analysis"],
        "03 - Recommendations": ["Proposals", "Implementation Plan"]
      };
    }
    return {};
  };

  useEffect(() => {
    if (firmType && timeStructure && clientTypes.length > 0) {
      const structure: PreviewStructure = {
        "Period Structure": generatePeriodStructure(timeStructure),
        "Client Types": clientTypes,
        "Document Organization": generateBinderStructure(binderStructure, firmType)
      };
      setPreviewStructure(structure);
    }
  }, [firmType, timeStructure, clientTypes, binderStructure]);

  const handleVerifyCredentials = () => {
    if (sharePointEmail && sharePointPassword) {
      setConnectionStatus('verifying');
      setTimeout(() => {
        setConnectionStatus('established');
      }, 1500);
    } else {
      setConnectionStatus('invalid');
    }
  };

  const handleStorageAllocation = () => {
    const amount = parseInt(storageAmount);
    if (amount > 1000) {
      setShowNotEnoughSpace(true);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addClientType = () => {
    if (newClientType.trim() && !clientTypes.includes(newClientType.trim())) {
      setClientTypes([...clientTypes, newClientType.trim()]);
      setNewClientType('');
    }
  };

  const removeClientType = (index: number) => {
    setClientTypes(clientTypes.filter((_, i) => i !== index));
  };

  const saveCurrentAsTemplate = () => {
    if (newTemplateName.trim()) {
      const newTemplate: Template = {
        name: newTemplateName,
        firmType,
        timeStructure,
        clientTypes: [...clientTypes],
        binderStructure
      };
      setCustomTemplates([...customTemplates, newTemplate]);
      setNewTemplateName('');
      setShowTemplateManager(false);
    }
  };

  const loadTemplate = (templateKey: string) => {
    const template = defaultTemplates[templateKey] || customTemplates.find(t => t.name === templateKey);
    if (template) {
      setFirmType(template.firmType);
      setTimeStructure(template.timeStructure);
      setClientTypes(template.clientTypes);
      setBinderStructure(template.binderStructure);
    }
  };

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Settings24Regular className={styles.brandIcon} />
          <Title2>Storage Settings</Title2>
        </div>
        <Button 
          appearance="primary" 
          icon={<Save24Regular />}
          style={{ backgroundColor: tokens.colorBrandBackground }}
        >
          Save changes
        </Button>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentContainer}>
          <div className={styles.gridContainer}>
            {/* Left Column - Storage Configuration */}
            <div className={styles.leftColumn}>
              {/* Storage Type Selection */}
              <Card className={styles.card}>
                <CardHeader>
                  <Title3>Storage Type</Title3>
                </CardHeader>
                <div className={styles.storageTypeGrid}>
                  <div
                    className={`${styles.storageTypeCard} ${
                      storageType === 'cloud' ? styles.storageTypeCardSelected : ''
                    }`}
                    onClick={() => setStorageType('cloud')}
                  >
                    <div className={styles.storageTypeContent}>
                      <CloudAdd24Regular style={{ color: tokens.colorBrandForeground1 }} />
                      <div className={styles.rows}>
                        <Body1>Cloud Storage</Body1>
                        <Caption1>SharePoint</Caption1>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    className={`${styles.storageTypeCard} ${
                      storageType === 'physical' ? styles.storageTypeCardSelected : ''
                    }`}
                    onClick={() => setStorageType('physical')}
                  >
                    <div className={styles.storageTypeContent}>
                      <HardDrive24Regular style={{ color: tokens.colorBrandForeground1 }} />
                      <div className={styles.rows}>
                        <Body1>Physical Storage</Body1>
                        <Caption1>Local/Network</Caption1>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Cloud Storage Configuration */}
              {storageType === 'cloud' && (
                <Card className={styles.card}>
                  <CardHeader>
                    <Title3>SharePoint Credentials</Title3>
                  </CardHeader>
                  <div className={styles.credentialsSection}>
                    <Field label="Email">
                      <Input
                        type="email"
                        value={sharePointEmail}
                        onChange={(e) => setSharePointEmail(e.target.value)}
                        placeholder="Enter SharePoint email"
                      />
                    </Field>
                    
                    <Field label="Password">
                      <Input
                        type="password"
                        value={sharePointPassword}
                        onChange={(e) => setSharePointPassword(e.target.value)}
                        placeholder="Enter password"
                      />
                    </Field>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: tokens.spacingHorizontalM }}>
                      {connectionStatus === 'invalid' && (
                        <div className={styles.statusError}>
                          <DismissCircle24Filled />
                          <Caption1>Invalid</Caption1>
                        </div>
                      )}
                      {connectionStatus === 'established' && (
                        <div className={styles.statusConnected}>
                          <CheckmarkCircle24Filled />
                          <Caption1>Connected</Caption1>
                        </div>
                      )}
                      
                      <Button
                        appearance="primary"
                        icon={connectionStatus === 'verifying' ? <Spinner size="tiny" /> : <CheckmarkCircle24Filled />}
                        onClick={handleVerifyCredentials}
                        disabled={connectionStatus === 'verifying'}
                        style={{ backgroundColor: tokens.colorBrandBackground }}
                      >
                        {
                        connectionStatus === 'verifying' ? 'Verifying...' : 
                        connectionStatus === 'invalid' ? 'Verify' :
                        connectionStatus === 'valid' ? 'Connected' :
                        'Verify'}
                      </Button>
                      
                      
                      
                    </div>
                  </div>
                </Card>
              )}

              {/* Physical Storage Configuration */}
              {storageType === 'physical' && (
                <Card className={styles.card}>
                  <CardHeader>
                    <Title3>Device Selection</Title3>
                  </CardHeader>
                  <div className={styles.deviceGrid}>
                    <div
                      className={`${styles.deviceCard} ${
                        deviceType === 'current' ? styles.deviceCardSelected : ''
                      }`}
                      onClick={() => setDeviceType('current')}
                    >
                      <div className={styles.deviceContent}>
                        <Desktop24Regular style={{ color: tokens.colorBrandForeground1 }} />
                        <div className={styles.rows} style={{ alignItems: 'flex-start' }}>
                          <Body1>Current Computer</Body1>
                          <Caption1>Local storage</Caption1>
                        </div>
                      </div>
                    </div>
                    
                    <div
                      className={`${styles.deviceCard} ${
                        deviceType === 'network' ? styles.deviceCardSelected : ''
                      }`}
                      onClick={() => setDeviceType('network')}
                    >
                      <div className={styles.deviceContent}>
                        <NetworkAdapter16Regular style={{ color: tokens.colorBrandForeground1 }} />
                        <div className={styles.rows} style={{ alignItems: 'flex-start' }}>
                          <Body1>Network Device</Body1>
                          <Caption1>Shared storage</Caption1>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Storage Amount Configuration */}
              {storageType && (
                <Card className={styles.card}>
                  <CardHeader>
                    <Title3>Storage Allocation</Title3>
                  </CardHeader>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL }}>
                    <div className={styles.storageAllocationSection}>
                      <Field label="Amount per Client" style={{ flex: 1 }}>
                        <Input
                          type="number"
                          value={storageAmount}
                          onChange={(e) => setStorageAmount(e.target.value)}
                          onBlur={handleStorageAllocation}
                          placeholder="Enter amount"
                        />
                      </Field>
                      <Field label="Unit" style={{ width: '100px' }}>
                        <Select
                          value={storageUnit}
                          onChange={(e) => setStorageUnit(e.target.value)}
                        >
                          <option value="MB">MB</option>
                          <option value="GB">GB</option>
                        </Select>
                      </Field>
                    </div>
                    
                    <div className={styles.storageDistribution}>
                      <Body1 style={{ marginBottom: tokens.spacingVerticalM }}>
                        Distribution
                      </Body1>
                      <div className={styles.distributionGrid}>
                        <div className={styles.distributionCard}>
                          <Body1>DMS</Body1>
                          <Caption1 style={{ marginBottom: tokens.spacingVerticalXS }}>Internal only</Caption1>
                          <Body1 style={{ color: tokens.colorBrandForeground1, fontWeight: tokens.fontWeightMedium }}>
                            {storageAmount ? `${Math.floor(parseInt(storageAmount) / 2)} ${storageUnit}` : '-- GB'}
                          </Body1>
                        </div>
                        <div className={styles.distributionCard}>
                          <Body1>Portal</Body1>
                          <Caption1 style={{ marginBottom: tokens.spacingVerticalXS }}>Client access</Caption1>
                          <Body1 style={{ color: tokens.colorBrandForeground1, fontWeight: tokens.fontWeightMedium }}>
                            {storageAmount ? `${Math.floor(parseInt(storageAmount) / 2)} ${storageUnit}` : '-- GB'}
                          </Body1>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Data Retention */}
              {storageType && (
                <Card className={styles.card}>
                  <CardHeader>
                    <Title3>Data Retention</Title3>
                  </CardHeader>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL }}>
                    <div className={styles.retentionSection}>
                      <Field label="Retention Period" style={{ flex: 1 }}>
                        <Select
                          value={retentionPeriod}
                          onChange={(e) => setRetentionPeriod(e.target.value)}
                        >
                          <option value="">Select period</option>
                          <option value="3">3 months</option>
                          <option value="6">6 months</option>
                          <option value="12">1 year</option>
                          <option value="24">2 years</option>
                          <option value="60">5 years</option>
                          <option value="custom">Custom</option>
                        </Select>
                      </Field>
                      
                      {retentionPeriod === 'custom' && (
                        <div className={styles.customRetentionSection}>
                          <Input
                            type="number"
                            placeholder="Amount"
                            style={{ width: '80px' }}
                          />
                          <Select
                            value={retentionUnit}
                            onChange={(e) => setRetentionUnit(e.target.value)}
                            style={{ width: '100px' }}
                          >
                            <option value="days">Days</option>
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                          </Select>
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.retentionInfo}>
                      <div className={styles.retentionInfoContent}>
                        <Clock24Regular className={styles.retentionIcon} />
                        <Caption1>
                          Data will be automatically deleted after the retention period expires
                        </Caption1>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Folder Structure */}
            <div className={styles.rightColumn}>
              {storageType && (
                <Card className={styles.card}>
                  <CardHeader>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Title3>Folder Structure</Title3>
                      <Button
                        appearance="subtle"
                        icon={<Add24Regular />}
                        onClick={() => setShowTemplateManager(true)}
                      >
                        Save Template
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL }}>
                    {/* Firm Type */}
                    <Field label="Firm Type">
                      <Select
                        value={firmType}
                        onChange={(e) => setFirmType(e.target.value)}
                      >
                        <option value="">Select type</option>
                        <option value="accounting">Accounting</option>
                        <option value="legal">Legal</option>
                        <option value="consulting">Consulting</option>
                        <option value="custom">Custom</option>
                      </Select>
                    </Field>

                    {/* Template Selection */}
                    {firmType && firmType !== 'custom' && (
                      <Field label="Template">
                        <Select
                          value={selectedTemplate}
                          onChange={(e) => {
                            setSelectedTemplate(e.target.value);
                            if (e.target.value !== 'custom' && e.target.value !== '') {
                              loadTemplate(e.target.value);
                            }
                          }}
                        >
                          <option value="">Select template</option>
                          <option value={firmType}>{defaultTemplates[firmType]?.name}</option>
                          {customTemplates.map((template, index) => (
                            <option key={index} value={template.name}>{template.name}</option>
                          ))}
                          <option value="custom">Custom</option>
                        </Select>
                      </Field>
                    )}

                    {/* Period Structure */}
                    <Field label="Period Structure">
                      <Select
                        value={timeStructure}
                        onChange={(e) => setTimeStructure(e.target.value)}
                      >
                        <option value="tax-year">Tax Years</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
                        <option value="custom-date">Custom Dates</option>
                      </Select>
                    </Field>

                    {/* Client Types */}
                    <div>
                      <Label>Client Types</Label>
                      <div className={styles.clientTypesList}>
                        {clientTypes.map((type, index) => (
                          <div key={index} className={styles.clientTypeItem}>
                            <Caption1>{type}</Caption1>
                            <Button
                              appearance="subtle"
                              icon={<Delete24Regular />}
                              size="small"
                              onClick={() => removeClientType(index)}
                            />
                          </div>
                        ))}
                        <div className={styles.addClientType}>
                          <Input
                            value={newClientType}
                            onChange={(e) => setNewClientType(e.target.value)}
                            placeholder="Add client type"
                            onKeyPress={(e) => e.key === 'Enter' && addClientType()}
                            style={{ flex: 1 }}
                          />
                          <Button
                            appearance="primary"
                            icon={<Add24Regular />}
                            onClick={addClientType}
                            style={{ backgroundColor: tokens.colorBrandBackground }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Binder Structure */}
                    {firmType && firmType !== 'custom' && (
                      <Field label={firmType === 'legal' ? 'Document Organization' : 'Binder Structure'}>
                        <Select
                          value={binderStructure}
                          onChange={(e) => setBinderStructure(e.target.value)}
                        >
                          {firmType === 'accounting' && (
                            <>
                              <option value="numerical">Numerical (1000, 2000, 3000)</option>
                              <option value="custom">Custom</option>
                            </>
                          )}
                          {firmType === 'legal' && (
                            <>
                              <option value="alphabetical">Alphabetical (A, B, C)</option>
                              <option value="planning">Planning → Deliverables</option>
                              <option value="custom">Custom</option>
                            </>
                          )}
                          {firmType === 'consulting' && (
                            <>
                              <option value="phases">Project Phases</option>
                              <option value="custom">Custom</option>
                            </>
                          )}
                        </Select>
                      </Field>
                    )}

                    {/* Live Preview */}
                    {previewStructure && (
                      <div className={styles.previewCard}>
                        <Body1 style={{ marginBottom: tokens.spacingVerticalM }}>
                          Live Preview
                        </Body1>
                        <div>
                          {Object.entries(previewStructure).map(([section, items]) => (
                            <div key={section} className={styles.previewSection}>
                              <div
                                className={styles.previewSectionHeader}
                                onClick={() => toggleSection(section)}
                              >
                                {expandedSections[section] ? <ChevronDown24Regular /> : <ChevronRight24Regular />}
                                <Caption1>{section}</Caption1>
                              </div>
                              {expandedSections[section] && (
                                <div className={styles.previewSectionContent}>
                                  {Array.isArray(items) ? (
                                    items.map((item, idx) => (
                                      <div key={idx} className={styles.previewItem}>• {item}</div>
                                    ))
                                  ) : (
                                    Object.entries(items as Record<string, string[]>).map(([folder, subItems]) => (
                                      <div key={folder}>
                                        <div className={styles.previewFolder}>📁 {folder}</div>
                                        {subItems.map((subItem, idx) => (
                                          <div key={idx} className={styles.previewSubItem}>• {subItem}</div>
                                        ))}
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Custom Structure */}
                    {(selectedTemplate === 'custom' || firmType === 'custom') && (
                      <Field label="Custom Structure">
                        <Textarea
                          value={customStructure}
                          onChange={(e) => setCustomStructure(e.target.value)}
                          rows={6}
                          placeholder="/Client Name&#10;  /Tax Year 2025&#10;    /1000 - Assets&#10;      /1000.01 - Cash&#10;    /2000 - Liabilities"
                        />
                      </Field>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Template Manager Modal */}
      {showTemplateManager && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <Title3 style={{ marginBottom: tokens.spacingVerticalL }}>Save Template</Title3>
            <div className={styles.dialogContent}>
              <Field label="Template Name">
                <Input
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Enter template name"
                />
              </Field>
              <div className={styles.configSummary}>
                <Body1 style={{ marginBottom: tokens.spacingVerticalS }}>
                  Current Configuration:
                </Body1>
                <Caption1>
                  • Firm Type: {firmType || 'Not set'}<br/>
                  • Period: {timeStructure}<br/>
                  • Client Types: {clientTypes.length} types<br/>
                  • Structure: {binderStructure}
                </Caption1>
              </div>
            </div>
            <div style={{ display: 'flex', gap: tokens.spacingHorizontalM, justifyContent: 'flex-end', marginTop: tokens.spacingVerticalXL }}>
              <Button
                appearance="secondary"
                onClick={() => setShowTemplateManager(false)}
              >
                Cancel
              </Button>
              <Button
                appearance="primary"
                icon={<Save24Regular />}
                onClick={saveCurrentAsTemplate}
                style={{ backgroundColor: tokens.colorBrandBackground }}
              >
                Save Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Not Enough Space Modal */}
      {showNotEnoughSpace && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalM, marginBottom: tokens.spacingVerticalL }}>
              <Warning24Filled style={{ color: tokens.colorPaletteRedForeground2 }} />
              <Title3>Not Enough Space</Title3>
            </div>
            <Body1 style={{ marginBottom: tokens.spacingVerticalXL }}>
              The requested storage amount exceeds available space. Please reduce allocation or contact IT.
            </Body1>
            <div style={{ display: 'flex', gap: tokens.spacingHorizontalM, justifyContent: 'flex-end' }}>
              <Button
                appearance="secondary"
                onClick={() => setShowNotEnoughSpace(false)}
              >
                Dismiss
              </Button>
              <Button appearance="primary" style={{ backgroundColor: tokens.colorPaletteRedBackground3 }}>
                Escalate Case
              </Button>
            </div>
          </div>
        </div>
      )}
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
    fontFamily: tokens.fontFamilyBase,
  },
  header: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXL}`,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: tokens.shadow2,
    '@media (max-width: 768px)': {
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    },
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  brandIcon: {
    color: tokens.colorBrandForeground1,
  },
  mainContent: {
    flex: 1,
    overflow: 'auto',
    padding: tokens.spacingHorizontalXL,
    '@media (max-width: 768px)': {
      padding: tokens.spacingHorizontalM,
    },
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: tokens.spacingHorizontalXL,
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
      gap: tokens.spacingHorizontalL,
    },
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXL,
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXL,
  },
  card: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalXL,
  },
  storageTypeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
    },
  },
  rows: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // gap: tokens.spacingHorizontalM,
  },
  storageTypeCard: {
    padding: tokens.spacingVerticalL,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    '&:hover': {
      border: `1px solid ${tokens.colorBrandStroke1}`,
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  storageTypeCardSelected: {
    border: `1px solid ${tokens.colorBrandStroke1}`,
    backgroundColor: tokens.colorBrandBackground2,
  },
  storageTypeContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalM,
  },
  deviceGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
    },
  },
  deviceCard: {
    padding: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      border: `1px solid ${tokens.colorBrandStroke1}`,
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  deviceCardSelected: {
    border: `1px solid ${tokens.colorBrandStroke1}`,
    backgroundColor: tokens.colorBrandBackground2,
  },
  deviceContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  storageDistribution: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalL,
  },
  distributionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
    },
  },
  distributionCard: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  retentionInfo: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalL,
    border: `1px solid ${tokens.colorPaletteGreenBorder2}`,
    color: tokens.colorPaletteGreenForeground2,
  },
  retentionInfoContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  retentionIcon: {
    flexShrink: 0,
    fontSize: '16px',
  },
  clientTypesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  clientTypeItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.colorNeutralBackground2,
    padding: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  addClientType: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
  previewCard: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalL,
  },
  previewSection: {
    marginBottom: tokens.spacingVerticalM,
  },
  previewSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    cursor: 'pointer',
    padding: tokens.spacingVerticalXS,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      borderRadius: tokens.borderRadiusSmall,
    },
  },
  previewSectionContent: {
    marginLeft: tokens.spacingHorizontalL,
    marginTop: tokens.spacingVerticalS,
  },
  previewItem: {
    color: tokens.colorNeutralForeground2,
    marginBottom: tokens.spacingVerticalXS,
  },
  previewFolder: {
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalXS,
  },
  previewSubItem: {
    marginLeft: tokens.spacingHorizontalL,
    color: tokens.colorNeutralForeground2,
    marginBottom: tokens.spacingVerticalXS,
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  configSummary: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalL,
    color: tokens.colorNeutralForeground2,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    padding: tokens.spacingVerticalXXL,
  },
  buttonPrimary: {
    backgroundColor: tokens.colorBrandBackground,
    '&:hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  statusVerifying: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    color: tokens.colorNeutralForeground2,
  },
  statusConnected: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    color: tokens.colorPaletteGreenForeground2,
  },
  statusError: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    color: tokens.colorPaletteRedForeground2,
  },
  credentialsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  storageAllocationSection: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 480px)': {
      flexDirection: 'column',
    },
  },
  retentionSection: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 480px)': {
      flexDirection: 'column',
    },
  },
  customRetentionSection: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
});