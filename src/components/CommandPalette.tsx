import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  FileText, 
  Kanban, 
  ArrowLeftRight, 
  Rocket, 
  CalendarDays, 
  Upload, 
  Download, 
  Laptop, 
  Monitor, 
  Plus, 
  Clock,
  Sparkles
} from 'lucide-react';
import { WorkspaceData } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  data: WorkspaceData;
  onSelectTab: (tab: string) => void;
  onSelectNote: (noteId: string) => void;
  onSwitchDevice: (device: string) => void;
  onQuickAction: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  data,
  onSelectTab,
  onSelectNote,
  onSwitchDevice,
  onQuickAction
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onQuickAction('open_command');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Matched Notes
  const matchedNotes = data.notes.filter(n => 
    n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  );

  // Matched Tasks
  const matchedTasks = data.tasks.filter(t => 
    t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
  );

  // Matched Bookmarks
  const matchedBookmarks = data.bookmarks.filter(b => 
    b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q)
  );

  // Quick Action Commands
  const actions = [
    { id: 'new_note', label: 'Create New Note', icon: <Plus className="w-4 h-4 text-emerald-400" />, tab: 'notes' },
    { id: 'new_drop', label: 'Drop Snippet / Clipboard', icon: <ArrowLeftRight className="w-4 h-4 text-purple-400" />, tab: 'sync' },
    { id: 'new_task', label: 'Create New Task', icon: <Kanban className="w-4 h-4 text-blue-400" />, tab: 'tasks' },
    { id: 'focus_timer', label: 'Open Focus Timer & Daily Log', icon: <Clock className="w-4 h-4 text-amber-400" />, tab: 'planner' },
    { id: 'backup', label: 'Download Full Workspace Backup', icon: <Download className="w-4 h-4 text-emerald-400" />, action: 'download_backup' },
    { id: 'switch_pc', label: 'Switch to Personal PC View', icon: <Monitor className="w-4 h-4 text-blue-400" />, device: 'Personal PC' },
    { id: 'switch_nb', label: 'Switch to Corporate Notebook View', icon: <Laptop className="w-4 h-4 text-emerald-400" />, device: 'Corporate Notebook' },
  ].filter(a => a.label.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-emerald-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search notes, tasks, portals..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-3 space-y-4 max-h-[60vh]">
          
          {/* Quick Commands */}
          {actions.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1 block">
                Quick Actions
              </span>
              <div className="space-y-1">
                {actions.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => {
                      if (act.tab) onSelectTab(act.tab);
                      if (act.device) onSwitchDevice(act.device);
                      if (act.action) onQuickAction(act.action);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      {act.icon}
                      <span>{act.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Jump</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Notes */}
          {matchedNotes.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1 block">
                Notes &amp; Specs ({matchedNotes.length})
              </span>
              <div className="space-y-1">
                {matchedNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      onSelectTab('notes');
                      onSelectNote(note.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-semibold text-white">{note.title}</span>
                        <span className="text-[11px] text-slate-500 ml-2 line-clamp-1">
                          {note.content.slice(0, 40)}...
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Tasks */}
          {matchedTasks.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1 block">
                Tasks ({matchedTasks.length})
              </span>
              <div className="space-y-1">
                {matchedTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      onSelectTab('tasks');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Kanban className="w-4 h-4 text-blue-400" />
                      <div>
                        <span className="font-semibold text-white">{task.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono ml-2">[{task.status}]</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Bookmarks */}
          {matchedBookmarks.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1 block">
                Bookmarks &amp; Portals
              </span>
              <div className="space-y-1">
                {matchedBookmarks.map((bm) => (
                  <a
                    key={bm.id}
                    href={bm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Rocket className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="font-semibold text-white">{bm.title}</span>
                        <span className="text-[11px] text-slate-500 font-mono ml-2">{bm.url}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">Open &rarr;</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {actions.length === 0 && matchedNotes.length === 0 && matchedTasks.length === 0 && matchedBookmarks.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching results for &ldquo;{query}&rdquo;
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>Navigate with mouse or keyboard</span>
          <span>VASUP Workspace Hub</span>
        </div>
      </div>
    </div>
  );
};
