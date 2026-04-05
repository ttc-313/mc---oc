export type TaskStatus = 'backlog' | 'in-progress' | 'review' | 'completed' | 'archived';

export type DocType = 'pdf' | 'word' | 'excel' | 'image' | 'text';
export type DocFolder = 'inbox' | 'starred' | 'archive' | 'trash';

export interface Document {
  id: string;
  title: string;
  type: DocType;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  folder: DocFolder;
  keywords: string[];
}

export interface TaskHistoryEntry {
  id: string;
  person: string;
  action: string;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  status: TaskStatus;
  projectId?: string;
  history?: TaskHistoryEntry[];
  progress?: number;
  dueDate?: string;
  scheduledTime?: string;
  isCron?: boolean;
  cronExpression?: string;
  cronScheduleText?: string;
  cronStatus?: 'enabled' | 'disabled';
  nextRun?: string;
  createdAt?: string;
  updatedAt?: string;
  isStuck?: boolean;
  tags?: string[];
  completedAt?: string;
  completedBy?: string;
  archiveId?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status?: 'active' | 'completed' | 'archived';
  tags?: string[];
  completedAt?: string;
  completedBy?: string;
  archiveId?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: string;
  responsibility: string;
  llmModels: string[];
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  keywords: string[];
}

