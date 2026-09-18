export interface Profile {
  userName: string;
  workspaceName: string;
  pcName: string;
  corporateNotebookId: string;
  activeDevice: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'to_do' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  device: string; // 'Personal PC' | 'Corporate Notebook' | 'Both'
  tags: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SyncDrop {
  id: string;
  type: 'text' | 'code' | 'link';
  title: string;
  content: string;
  sourceDevice: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SharedFile {
  id: string;
  originalName: string;
  filename: string;
  size: number;
  mimetype: string;
  uploadedFrom: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
  icon: string;
  color: string;
}

export interface Activity {
  id: string;
  time: string;
  description: string;
  type: string;
}

export interface SystemInfo {
  hostname: string;
  platform: string;
  arch: string;
  networkAddresses: { interface: string; address: string }[];
  port: number;
  clientPort: number;
}

export interface WorkspaceData {
  profile: Profile;
  notes: Note[];
  tasks: Task[];
  syncDrops: SyncDrop[];
  files: SharedFile[];
  bookmarks: Bookmark[];
  activities: Activity[];
  systemInfo?: SystemInfo;
}
