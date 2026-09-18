import { WorkspaceData, Note, Task, SyncDrop, SharedFile, Bookmark, Activity, Profile } from './types';

const API_BASE = '/api';

export const api = {
  // 1. Full Workspace State
  async getWorkspace(): Promise<WorkspaceData> {
    const res = await fetch(`${API_BASE}/workspace`);
    if (!res.ok) throw new Error('Failed to fetch workspace data');
    return res.json();
  },

  async restoreWorkspace(data: WorkspaceData): Promise<{ success: boolean; data: WorkspaceData }> {
    const res = await fetch(`${API_BASE}/workspace/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to restore workspace data');
    return res.json();
  },

  async resetWorkspace(): Promise<{ success: boolean; data: WorkspaceData }> {
    const res = await fetch(`${API_BASE}/workspace/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset workspace');
    return res.json();
  },

  // 2. Notes CRUD & Download
  async createNote(note: Partial<Note>): Promise<Note> {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    if (!res.ok) throw new Error('Failed to create note');
    return res.json();
  },

  async updateNote(id: string, note: Partial<Note>): Promise<Note> {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    if (!res.ok) throw new Error('Failed to update note');
    return res.json();
  },

  async deleteNote(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete note');
  },

  downloadNote(id: string, format: 'md' | 'txt' = 'md') {
    window.location.href = `${API_BASE}/notes/${id}/download?format=${format}`;
  },

  // 3. Tasks CRUD
  async createTask(task: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  async deleteTask(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
  },

  // 4. Sync Drops CRUD
  async createSyncDrop(drop: Partial<SyncDrop>): Promise<SyncDrop> {
    const res = await fetch(`${API_BASE}/sync/drops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(drop)
    });
    if (!res.ok) throw new Error('Failed to create sync drop');
    return res.json();
  },

  async updateSyncDrop(id: string, drop: Partial<SyncDrop>): Promise<SyncDrop> {
    const res = await fetch(`${API_BASE}/sync/drops/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(drop)
    });
    if (!res.ok) throw new Error('Failed to update sync drop');
    return res.json();
  },

  async deleteSyncDrop(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/sync/drops/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete sync drop');
  },

  // 5. Shared Files Upload & Download & Delete
  async uploadFile(file: File, sourceDevice: string): Promise<SharedFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sourceDevice', sourceDevice);

    const res = await fetch(`${API_BASE}/sync/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload file');
    return res.json();
  },

  downloadFile(filename: string) {
    window.open(`${API_BASE}/sync/download/${filename}`, '_blank');
  },

  async deleteFile(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/sync/files/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete file');
  },

  // 6. Bookmarks CRUD
  async createBookmark(bm: Partial<Bookmark>): Promise<Bookmark> {
    const res = await fetch(`${API_BASE}/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bm)
    });
    if (!res.ok) throw new Error('Failed to create bookmark');
    return res.json();
  },

  async updateBookmark(id: string, bm: Partial<Bookmark>): Promise<Bookmark> {
    const res = await fetch(`${API_BASE}/bookmarks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bm)
    });
    if (!res.ok) throw new Error('Failed to update bookmark');
    return res.json();
  },

  async deleteBookmark(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/bookmarks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete bookmark');
  },

  // 7. Activity Logs
  async createActivity(activity: { description: string; type?: string }): Promise<Activity> {
    const res = await fetch(`${API_BASE}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity)
    });
    if (!res.ok) throw new Error('Failed to log activity');
    return res.json();
  },

  async deleteActivity(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/activities/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete activity');
  },

  // 8. Profile
  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  }
};
