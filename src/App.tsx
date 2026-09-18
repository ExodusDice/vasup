import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  FileText, 
  Kanban, 
  Rocket, 
  CalendarDays, 
  Plus, 
  Check, 
  AlertCircle,
  Laptop,
  Monitor
} from 'lucide-react';
import { WorkspaceData, Note, Task, SyncDrop, SharedFile, Bookmark, Activity, Profile } from './types';
import { api } from './api';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { SyncHub } from './components/SyncHub';
import { NotesWorkspace } from './components/NotesWorkspace';
import { ActivityKanban } from './components/ActivityKanban';
import { QuickLaunchpad } from './components/QuickLaunchpad';
import { DailyPlanner } from './components/DailyPlanner';
import { CommandPalette } from './components/CommandPalette';
import { WorkspaceSettingsModal } from './components/WorkspaceSettingsModal';

export const App: React.FC = () => {
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sync' | 'notes' | 'tasks' | 'launchpad' | 'planner'>('overview');
  const [activeDevice, setActiveDevice] = useState<string>('Personal PC');
  const [isSaving, setIsSaving] = useState(false);

  // Command palette & settings modal
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Notification toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      const ws = await api.getWorkspace();
      setData(ws);
      if (ws.profile?.activeDevice) {
        setActiveDevice(ws.profile.activeDevice);
      }
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Could not connect to VASUP Workspace backend. Make sure the local server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Periodic light sync every 10 seconds for multi-device sync
    const interval = setInterval(() => {
      api.getWorkspace().then(ws => {
        setData(prev => ({
          ...ws,
          // keep local device toggle
          profile: {
            ...ws.profile,
            activeDevice: activeDevice
          }
        }));
      }).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDeviceChange = async (device: string) => {
    setActiveDevice(device);
    if (data) {
      setData({
        ...data,
        profile: { ...data.profile, activeDevice: device }
      });
      await api.updateProfile({ activeDevice: device });
      showToast(`Switched active environment to ${device}`, 'info');
    }
  };

  // --- Handlers: Notes ---
  const handleAddNote = async (note: Partial<Note>): Promise<Note> => {
    setIsSaving(true);
    try {
      const created = await api.createNote(note);
      setData(prev => prev ? { ...prev, notes: [created, ...prev.notes] } : null);
      showToast('Note created successfully');
      return created;
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateNote = async (id: string, note: Partial<Note>): Promise<Note> => {
    setIsSaving(true);
    try {
      const updated = await api.updateNote(id, note);
      setData(prev => prev ? {
        ...prev,
        notes: prev.notes.map(n => n.id === id ? updated : n)
      } : null);
      showToast('Note saved');
      return updated;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: string): Promise<void> => {
    setIsSaving(true);
    try {
      await api.deleteNote(id);
      setData(prev => prev ? {
        ...prev,
        notes: prev.notes.filter(n => n.id !== id)
      } : null);
      showToast('Note deleted');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadNote = (id: string, format: 'md' | 'txt') => {
    api.downloadNote(id, format);
    showToast(`Downloading note as .${format}`, 'info');
  };

  // --- Handlers: Tasks ---
  const handleAddTask = async (task: Partial<Task>): Promise<Task> => {
    setIsSaving(true);
    try {
      const created = await api.createTask(task);
      setData(prev => prev ? { ...prev, tasks: [...prev.tasks, created] } : null);
      showToast('Task added to Kanban');
      return created;
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
    setIsSaving(true);
    try {
      const updated = await api.updateTask(id, task);
      setData(prev => prev ? {
        ...prev,
        tasks: prev.tasks.map(t => t.id === id ? updated : t)
      } : null);
      showToast('Task updated');
      return updated;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTask = async (id: string): Promise<void> => {
    setIsSaving(true);
    try {
      await api.deleteTask(id);
      setData(prev => prev ? {
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== id)
      } : null);
      showToast('Task deleted');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Handlers: Sync Drops ---
  const handleAddDrop = async (drop: Partial<SyncDrop>) => {
    setIsSaving(true);
    try {
      const created = await api.createSyncDrop(drop);
      setData(prev => prev ? { ...prev, syncDrops: [created, ...prev.syncDrops] } : null);
      showToast('Snippet dropped to Workspace Sync');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateDrop = async (id: string, drop: Partial<SyncDrop>) => {
    setIsSaving(true);
    try {
      const updated = await api.updateSyncDrop(id, drop);
      setData(prev => prev ? {
        ...prev,
        syncDrops: prev.syncDrops.map(d => d.id === id ? updated : d)
      } : null);
      showToast('Snippet updated');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDrop = async (id: string) => {
    setIsSaving(true);
    try {
      await api.deleteSyncDrop(id);
      setData(prev => prev ? {
        ...prev,
        syncDrops: prev.syncDrops.filter(d => d.id !== id)
      } : null);
      showToast('Snippet removed');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Handlers: Files ---
  const handleUploadFile = async (file: File) => {
    setIsSaving(true);
    try {
      const uploaded = await api.uploadFile(file, activeDevice);
      setData(prev => prev ? {
        ...prev,
        files: [uploaded, ...(prev.files || [])]
      } : null);
      showToast(`File "${file.name}" uploaded successfully`);
    } catch (err) {
      showToast('Failed to upload file', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFile = async (id: string) => {
    setIsSaving(true);
    try {
      await api.deleteFile(id);
      setData(prev => prev ? {
        ...prev,
        files: (prev.files || []).filter(f => f.id !== id)
      } : null);
      showToast('File deleted');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadFile = (filename: string) => {
    api.downloadFile(filename);
    showToast('Download started', 'info');
  };

  // --- Handlers: Bookmarks ---
  const handleAddBookmark = async (bm: Partial<Bookmark>): Promise<Bookmark> => {
    setIsSaving(true);
    try {
      const created = await api.createBookmark(bm);
      setData(prev => prev ? { ...prev, bookmarks: [...prev.bookmarks, created] } : null);
      showToast('Bookmark added');
      return created;
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateBookmark = async (id: string, bm: Partial<Bookmark>): Promise<Bookmark> => {
    setIsSaving(true);
    try {
      const updated = await api.updateBookmark(id, bm);
      setData(prev => prev ? {
        ...prev,
        bookmarks: prev.bookmarks.map(b => b.id === id ? updated : b)
      } : null);
      showToast('Bookmark updated');
      return updated;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBookmark = async (id: string): Promise<void> => {
    setIsSaving(true);
    try {
      await api.deleteBookmark(id);
      setData(prev => prev ? {
        ...prev,
        bookmarks: prev.bookmarks.filter(b => b.id !== id)
      } : null);
      showToast('Bookmark removed');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Handlers: Activities ---
  const handleAddActivity = async (act: { description: string; type?: string }): Promise<Activity> => {
    setIsSaving(true);
    try {
      const created = await api.createActivity(act);
      setData(prev => prev ? {
        ...prev,
        activities: [created, ...(prev.activities || [])]
      } : null);
      showToast('Activity logged');
      return created;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteActivity = async (id: string): Promise<void> => {
    setIsSaving(true);
    try {
      await api.deleteActivity(id);
      setData(prev => prev ? {
        ...prev,
        activities: (prev.activities || []).filter(a => a.id !== id)
      } : null);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Backup & Restore ---
  const handleDownloadBackup = () => {
    window.location.href = '/api/workspace/backup';
    showToast('Downloading full workspace backup (JSON)', 'info');
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const res = await api.restoreWorkspace(json);
        setData(res.data);
        showToast('Workspace successfully restored from backup!');
      } catch (err) {
        showToast('Invalid backup JSON file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetWorkspace = async () => {
    const res = await api.resetWorkspace();
    setData(res.data);
    showToast('Workspace reset to defaults', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-slate-950 text-2xl shadow-xl shadow-emerald-500/20 animate-pulse">
          V
        </div>
        <p className="text-sm font-medium">Loading VASUP Workspace...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-2xl bg-red-950/40 text-red-400 border border-red-900/60 max-w-md space-y-3">
          <AlertCircle className="w-8 h-8 mx-auto text-red-400" />
          <h2 className="text-base font-bold text-white">Connection Error</h2>
          <p className="text-xs text-slate-300">{error || 'Unable to connect'}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col bg-grid-pattern selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold border backdrop-blur-xl animate-fade-in ${
          toast.type === 'error'
            ? 'bg-red-950/90 text-red-200 border-red-800'
            : toast.type === 'info'
            ? 'bg-blue-950/90 text-blue-200 border-blue-800'
            : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-400" /> : <Check className="w-4 h-4 text-emerald-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        profile={data.profile}
        systemInfo={data.systemInfo}
        activeDevice={activeDevice}
        onDeviceChange={handleDeviceChange}
        onOpenCommandPalette={() => setIsCommandOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onDownloadBackup={handleDownloadBackup}
        onRestoreBackup={handleRestoreBackup}
        onResetWorkspace={handleResetWorkspace}
        isSaving={isSaving}
      />

      {/* Main Workspace Navigation Tabs */}
      <div className="border-b border-slate-800/80 bg-slate-950/50 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar text-xs font-medium">
            
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Workspace Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('sync')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'sync'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>WFH ↔ In-House Sync Hub</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
                {data.syncDrops.length + (data.files || []).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'notes'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Notes &amp; Specs</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
                {data.notes.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'tasks'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Activity &amp; Task Kanban</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
                {data.tasks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('launchpad')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'launchpad'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Rocket className="w-4 h-4" />
              <span>Quick Portals</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
                {data.bookmarks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'planner'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Daily Planner &amp; Focus</span>
            </button>

          </div>
        </div>
      </div>

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <DashboardOverview
            data={data}
            activeDevice={activeDevice}
            onSelectTab={(tab) => setActiveTab(tab as any)}
            onSelectNote={(id) => {
              setActiveTab('notes');
            }}
            onDownloadFile={handleDownloadFile}
          />
        )}

        {activeTab === 'sync' && (
          <SyncHub
            syncDrops={data.syncDrops}
            files={data.files || []}
            activeDevice={activeDevice}
            onAddDrop={handleAddDrop}
            onUpdateDrop={handleUpdateDrop}
            onDeleteDrop={handleDeleteDrop}
            onUploadFile={handleUploadFile}
            onDeleteFile={handleDeleteFile}
            onDownloadFile={handleDownloadFile}
          />
        )}

        {activeTab === 'notes' && (
          <NotesWorkspace
            notes={data.notes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onDownloadNote={handleDownloadNote}
          />
        )}

        {activeTab === 'tasks' && (
          <ActivityKanban
            tasks={data.tasks}
            activeDevice={activeDevice}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'launchpad' && (
          <QuickLaunchpad
            bookmarks={data.bookmarks}
            onAddBookmark={handleAddBookmark}
            onUpdateBookmark={handleUpdateBookmark}
            onDeleteBookmark={handleDeleteBookmark}
          />
        )}

        {activeTab === 'planner' && (
          <DailyPlanner
            activities={data.activities || []}
            onAddActivity={handleAddActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        )}
      </main>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        data={data}
        onSelectTab={(tab) => setActiveTab(tab as any)}
        onSelectNote={() => setActiveTab('notes')}
        onSwitchDevice={handleDeviceChange}
        onQuickAction={(action) => {
          if (action === 'download_backup') handleDownloadBackup();
          if (action === 'open_command') setIsCommandOpen(true);
        }}
      />

      {/* Workspace Settings Modal */}
      <WorkspaceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={data.profile}
        onUpdateProfile={async (p) => {
          const updated = await api.updateProfile(p);
          setData(prev => prev ? { ...prev, profile: updated } : null);
          showToast('Workspace settings saved');
          return updated;
        }}
        onDownloadBackup={handleDownloadBackup}
        onRestoreBackup={handleRestoreBackup}
        onResetWorkspace={handleResetWorkspace}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VASUP Hub &bull; vasup.franktest.xyz &bull; {data.profile.workspaceName}</span>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Save &bull; Edit &bull; Download &bull; Delete</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-semibold">{activeDevice} Active</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
