// table.ts - Type Definitions

// Badge Types
export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'active' | 'draft' | 'outbound' | 'inbound' | 'completed' | 'abandoned' | 'published' | 'default' | 'processing' | 'error' | 'connected' | 'notConnected' | 'popular';
  className?: string;
}

// Progress Bar Types
export interface ProgressBarProps {
  percentage: number;
  className?: string;
}

// Icon Types
export interface IconProps {
  className?: string;
}

// Column Configuration Type
export interface ColumnConfig<T> {
  key: string;
  header: string;
  width?: string;
  render?: (row: T) => React.ReactElement | string;
}

// Table Types
export type TableType = 'topAgents' | 'agents' | 'conversations' | 'documents' | 'workflows';

export interface TableProps<T> {
  type: TableType;
  data: T[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  title?: string;
  viewToggle?: boolean;
  className?: string;
}

// Data Model Types
export interface TopAgent extends Record<string, unknown> {
  name: string;
  conversations: string;
  progress: number;
  success: string;
  status: string;
  statusVariant: 'active' | 'draft';
}

export interface AgentsTable extends Record<string, unknown> {
  name: string;
  type: string;
  typeVariant: 'outbound' | 'inbound';
  status: string;
  statusVariant: 'active';
  conversations: string;
  successRate: string;
  lastActive: string;
}

export interface WorkflowsTable extends Record<string, unknown> {
  name: string;
  linkedAgent: string;
  status: string;
  statusVariant: 'published' | 'draft' | 'active';
  nodes: number;
  lastEdited: string;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface Conversation extends Record<string, unknown> {
  customerName: string;
  customerEmail: string;
  agent: string;
  channel: string;
  duration: string;
  status: string;
  statusVariant: 'completed' | 'abandoned';
  stars: number;
  rating: string;
  date: string;
  time: string;
}

export interface Document extends Record<string, unknown> {
  name: string;
  type: string;
  status: string;
  statusVariant: 'published' | 'draft' | 'processing' | 'error';
  size: string;
  lastUpdated: string;
}