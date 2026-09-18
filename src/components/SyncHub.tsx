import React, { useState, useRef } from 'react';
import { 
  ArrowLeftRight, 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Copy, 
  Check, 
  Edit3, 
  Plus, 
  Laptop, 
  Monitor, 
  FileCode, 
  File, 
  Link as LinkIcon, 
  Share2,
  FolderDown
} from 'lucide-react';
import { SyncDrop, SharedFile } from '../types';

interface SyncHubProps {
  syncDrops: SyncDrop[];
  files: SharedFile[];
  activeDevice: string;
  onAddDrop: (drop: Partial<SyncDrop>) => void;
  onUpdateDrop: (id: string, drop: Partial<SyncDrop>) => void;
  onDeleteDrop: (id: string) => void;
  onUploadFile: (file: File) => void;
  onDeleteFile: (id: string) => void;
  onDownloadFile: (filename: string) => void;
}

export const SyncHub: React.FC<SyncHubProps> = ({
  syncDrops,
  files,
  activeDevice,
  onAddDrop,
  onUpdateDrop,
  onDeleteDrop,
  onUploadFile,
  onDeleteFile,
  onDownloadFile
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'snippets' | 'files'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDrop, setEditingDrop] = useState<SyncDrop | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'text' | 'code' | 'link'>('text');

  // Copy indicator state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadSnippet = (drop: SyncDrop) => {
    const ext = drop.type === 'code' ? 'txt' : 'txt';
    const blob = new Blob([drop.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${drop.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'snippet'}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveDrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    if (editingDrop) {
      onUpdateDrop(editingDrop.id, {
        title: newTitle,
        content: newContent,
        type: newType,
        sourceDevice: activeDevice
      });
      setEditingDrop(null);
    } else {
      onAddDrop({
        title: newTitle,
        content: newContent,
        type: newType,
        sourceDevice: activeDevice
      });
    }

    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  const startEdit = (drop: SyncDrop) => {
    setEditingDrop(drop);
    setNewTitle(drop.title);
    setNewContent(drop.content);
    setNewType(drop.type);
    setShowAddModal(true);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Banner */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/40 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ArrowLeftRight className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">WFH ↔ VASUP In-House Office Sync Hub</h2>
            </div>
            <p className="text-sm text-slate-400">
              Instantly share files, clipboard snippets, code blocks, and VPN tokens between your WFH Home PC and In-House Office Notebook.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Upload file trigger */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 hover:border-slate-600 transition-all shadow-md"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Drop / Upload File</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Add text snippet trigger */}
            <button
              onClick={() => {
                setEditingDrop(null);
                setNewTitle('');
                setNewContent('');
                setNewType('text');
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Drop Snippet / Text</span>
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/60">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Drops ({syncDrops.length + files.length})
          </button>
          <button
            onClick={() => setActiveTab('snippets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'snippets'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Text &amp; Clipboard Snippets ({syncDrops.length})
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'files'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Shared Files ({files.length})
          </button>
        </div>
      </div>

      {/* Grid of Shared Files and Drops */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Files Section (if not filtered out) */}
        {(activeTab === 'all' || activeTab === 'files') && files.map((file) => (
          <div
            key={file.id}
            className="glass-card p-5 rounded-2xl flex flex-col justify-between border border-slate-800 hover:border-emerald-500/40 transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/40">
                    <File className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {file.originalName}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {formatFileSize(file.size)} &bull; {new Date(file.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700">
                  {file.uploadedFrom.includes('Notebook') ? <Laptop className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                  {file.uploadedFrom}
                </span>
              </div>
            </div>

            {/* Actions for File: Download, Delete */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60">
              <span className="text-[11px] text-slate-500 font-mono">
                {file.mimetype || 'File'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDownloadFile(file.filename)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-lg transition-colors shadow-sm"
                  title="Download File to this device"
                >
                  <FolderDown className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => onDeleteFile(file.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                  title="Delete File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Text / Snippet Drops (if not filtered out) */}
        {(activeTab === 'all' || activeTab === 'snippets') && syncDrops.map((drop) => (
          <div
            key={drop.id}
            className="glass-card p-5 rounded-2xl flex flex-col justify-between border border-slate-800 hover:border-emerald-500/40 transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl border ${
                    drop.type === 'code' 
                      ? 'bg-purple-950/60 text-purple-400 border-purple-800/40'
                      : drop.type === 'link'
                      ? 'bg-teal-950/60 text-teal-400 border-teal-800/40'
                      : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                  }`}>
                    {drop.type === 'code' ? <FileCode className="w-4 h-4" /> : drop.type === 'link' ? <LinkIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {drop.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(drop.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700">
                  {drop.sourceDevice.includes('Notebook') ? <Laptop className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                  {drop.sourceDevice}
                </span>
              </div>

              {/* Content box */}
              <div className="mt-3 p-3 bg-slate-950/90 rounded-xl border border-slate-800/90 font-mono text-xs text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap select-all">
                {drop.content}
              </div>
            </div>

            {/* Action buttons: Copy, Edit, Download, Delete */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60">
              <button
                onClick={() => handleCopy(drop.content, drop.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  copiedId === drop.id
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title="Copy snippet to clipboard"
              >
                {copiedId === drop.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDownloadSnippet(drop)}
                  className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Download snippet as text file"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => startEdit(drop)}
                  className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Edit Snippet"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteDrop(drop.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                  title="Delete Snippet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {syncDrops.length === 0 && files.length === 0 && (
          <div className="col-span-full text-center py-12 glass-panel rounded-2xl border border-dashed border-slate-800">
            <Share2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No sync drops yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Drop text, code snippets, tokens, or files to access them seamlessly on your PC and Corporate Notebook.
            </p>
            <button
              onClick={() => {
                setEditingDrop(null);
                setNewTitle('');
                setNewContent('');
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl"
            >
              Drop First Snippet
            </button>
          </div>
        )}
      </div>

      {/* Modal for Adding / Editing Drops */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-white">
                {editingDrop ? 'Edit Sync Snippet' : 'Drop New Snippet / Clipboard'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDrop} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Snippet Title / Label</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Corporate VPN Token / Git Command / Note"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setNewType('text')}
                  className={`py-2 text-xs rounded-xl font-medium border text-center ${
                    newType === 'text'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Text / Note
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('code')}
                  className={`py-2 text-xs rounded-xl font-medium border text-center ${
                    newType === 'code'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Code / Script
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('link')}
                  className={`py-2 text-xs rounded-xl font-medium border text-center ${
                    newType === 'link'
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  URL / Link
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Content</label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste or write content here..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  Origin: {activeDevice}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-colors shadow-md shadow-emerald-500/20"
                  >
                    {editingDrop ? 'Save Changes' : 'Drop to Workspace'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
