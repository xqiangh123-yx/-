export enum NodeType {
  START = 'START',
  PROCESS = 'PROCESS',
  END = 'END'
}

export enum NodeStatus {
  HEALTHY = 'HEALTHY',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export interface Metric {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  isLeading: boolean; // Process indicator vs Result indicator
}

export interface ProcessNode {
  id: string;
  title: string;
  type: NodeType;
  status: NodeStatus;
  metrics: Metric[];
  x: number;
  y: number;
  description: string;
  activeTasks: number;
}

export interface Rule {
  id: string;
  nodeId: string;
  conditionMetric: string;
  operator: '>' | '<' | '=' | '>=' | '<=';
  threshold: number;
  triggerAction: string;
  targetRole: string;
  sopId?: string;
}

export interface SOP {
  id: string;
  title: string;
  content: string; // Markdown or HTML
  steps: string[];
}

export interface Task {
  id: string;
  title: string;
  nodeId: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  dueDate: string; // ISO String
  description: string;
  sopId: string; // Linked SOP
  feedback?: {
    rootCause: string;
    comment: string;
  };
}