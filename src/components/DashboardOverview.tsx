import React from 'react';
import { 
  ArrowLeftRight, 
  FileText, 
  Kanban, 
  Rocket, 
  Clock, 
  Laptop, 
  Monitor, 
  Copy, 
  Check, 
  Plus, 
  ChevronRight, 
  Download,
  Flame,
  CheckCircle2,
  FolderDown,
  Sparkles
} from 'lucide-react';
import { WorkspaceData, Task, Note, SyncDrop, SharedFile } from '../types';

interface DashboardOverviewProps {
  data: WorkspaceData;
  activeDevice: string;
  onSelectTab: (tab: string) => void;
  onSelectNote: (id: string) => void;
  onDownloadFile: (filename: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  data,
  activeDevice,
  onSelectTab,
  onSelectNote,
  onDownloadFile
}) => {
  const [copiedDropId, setCopiedDropId] = React.useState<string | null>(null);
  const [welcomeDismissed, setWelcomeDismissed] = React.useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDropId(id);
    setTimeout(() => setCopiedDropId(null), 2000);
  };

  const inProgressTasks = data.tasks.filter(t => t.status === 'in_progress' || t.status === 'to_do');
  const recentDrops = data.syncDrops.slice(0, 3);
  const recentFiles = (data.files || []).slice(0, 2);
  const pinnedNotes = data.notes.filter(n => n.pinned).slice(0, 3);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Hero & Status Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>vasup.franktest.xyz &bull; Live &amp; Synced</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {getGreeting()}, <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">{data.profile.userName || 'Frank'}</span> 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Welcome to your <strong>VASUP WFH &amp; In-House Office Workspace</strong>. Seamlessly switch between your 
              <span className="text-emerald-400 font-semibold"> WFH Home PC</span> and <span className="text-teal-300 font-semibold">In-House Corporate Notebook</span>. 
              Save, edit, download, and synchronize your daily activities in real-time.
            </p>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              <button
                onClick={() => onSelectTab('sync')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/25"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Drop File / Snippet to Office</span>
              </button>

              <button
                onClick={() => onSelectTab('notes')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>New WFH Note</span>
              </button>

              <button
                onClick={() => onSelectTab('planner')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Daily Standup &amp; Focus</span>
              </button>
            </div>
          </div>

          {/* Quick Stat Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('sync')}
              className="p-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-2xl text-left transition-all hover:border-purple-500/40"
            >
              <div className="flex items-center justify-between text-purple-400 mb-1">
                <ArrowLeftRight className="w-4 h-4" />
                <span className="text-base font-bold text-white font-mono">{data.syncDrops.length + (data.files || []).length}</span>
              </div>
              <span className="text-[11px] text-slate-400">Sync Drops</span>
            </button>

            <button
              onClick={() => onSelectTab('tasks')}
              className="p-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-2xl text-left transition-all hover:border-blue-500/40"
            >
              <div className="flex items-center justify-between text-blue-400 mb-1">
                <Kanban className="w-4 h-4" />
                <span className="text-base font-bold text-white font-mono">{data.tasks.length}</span>
              </div>
              <span className="text-[11px] text-slate-400">Total Tasks</span>
            </button>

            <button
              onClick={() => onSelectTab('notes')}
              className="p-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-2xl text-left transition-all hover:border-emerald-500/40"
            >
              <div className="flex items-center justify-between text-emerald-400 mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-base font-bold text-white font-mono">{data.notes.length}</span>
              </div>
              <span className="text-[11px] text-slate-400">Notes &amp; Specs</span>
            </button>

            <button
              onClick={() => onSelectTab('launchpad')}
              className="p-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-2xl text-left transition-all hover:border-amber-500/40"
            >
              <div className="flex items-center justify-between text-amber-400 mb-1">
                <Rocket className="w-4 h-4" />
                <span className="text-base font-bold text-white font-mono">{data.bookmarks.length}</span>
              </div>
              <span className="text-[11px] text-slate-400">In-House Portals</span>
            </button>
          </div>

        </div>
      </div>

      {/* Getting Started / Integration Checklist */}
      {!welcomeDismissed && (
        <div className="glass-panel p-5 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 relative">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-900/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                WFH ↔ In-House Quick Start Checklist
              </h3>
            </div>
            <button
              onClick={() => setWelcomeDismissed(true)}
              className="text-[11px] text-emerald-400/80 hover:text-emerald-200"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">1. WFH Home PC Connected</span>
                <span className="text-[11px] text-slate-400">Ready for editing and sync drops</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">2. In-House Notebook Sync</span>
                <span className="text-[11px] text-slate-400">Access via Sync Link or domain</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">3. File &amp; Snippet Transfer</span>
                <span className="text-[11px] text-slate-400">Share files, VPN tokens, &amp; keys</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">4. Daily Standup &amp; Export</span>
                <span className="text-[11px] text-slate-400">Log progress &amp; export report (.md)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Sync Drops & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Quick Sync Drops & Files */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Latest WFH ↔ In-House Drops</h3>
            </div>
            <button
              onClick={() => onSelectTab('sync')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentDrops.map((drop) => (
              <div
                key={drop.id}
                className="glass-card p-4 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-xs font-semibold text-white">{drop.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      From {drop.sourceDevice} &bull; {new Date(drop.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(drop.content, drop.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                  >
                    {copiedDropId === drop.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-2.5 bg-slate-950/80 rounded-lg font-mono text-[11px] text-slate-300 line-clamp-2 select-all border border-slate-800/80">
                  {drop.content}
                </div>
              </div>
            ))}

            {recentFiles.map((file) => (
              <div
                key={file.id}
                className="glass-card p-3.5 rounded-xl border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/40">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white line-clamp-1">{file.originalName}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">From {file.uploadedFrom}</span>
                  </div>
                </div>

                <button
                  onClick={() => onDownloadFile(file.filename)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-lg transition-colors"
                >
                  <FolderDown className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            ))}

            {recentDrops.length === 0 && recentFiles.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500 glass-card rounded-xl">
                No items dropped yet. Go to Sync Hub to transfer files or text between machines.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Tasks & Pinned Notes */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Kanban className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Active Corporate &amp; PC Tasks</h3>
            </div>
            <button
              onClick={() => onSelectTab('tasks')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <span>Kanban Board</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {inProgressTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="glass-card p-3.5 rounded-xl border border-slate-800/90 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === 'in_progress' ? 'bg-blue-400 animate-pulse' : 'bg-slate-500'
                  }`} />
                  <div>
                    <h4 className="text-xs font-semibold text-white line-clamp-1">{task.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {task.device} &bull; Priority: {task.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            ))}

            {inProgressTasks.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500 glass-card rounded-xl">
                All tasks completed! Great job.
              </div>
            )}
          </div>

          {/* Pinned Notes Quick Access */}
          {pinnedNotes.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 mb-2 block">Pinned Docs</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pinnedNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      onSelectTab('notes');
                      onSelectNote(note.id);
                    }}
                    className="p-3 bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 rounded-xl text-left transition-colors flex flex-col justify-between"
                  >
                    <span className="text-xs font-semibold text-white line-clamp-1">{note.title}</span>
                    <span className="text-[10px] text-slate-500 mt-1 font-mono">Click to open &rarr;</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
