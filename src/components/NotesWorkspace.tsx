import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Save, 
  Pin, 
  Search, 
  Eye, 
  Edit3, 
  Copy, 
  Check, 
  Tag, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { Note } from '../types';

interface NotesWorkspaceProps {
  notes: Note[];
  onAddNote: (note: Partial<Note>) => Promise<Note>;
  onUpdateNote: (id: string, note: Partial<Note>) => Promise<Note>;
  onDeleteNote: (id: string) => Promise<void>;
  onDownloadNote: (id: string, format: 'md' | 'txt') => void;
}

export const NotesWorkspace: React.FC<NotesWorkspaceProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onDownloadNote
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');
  
  // Local edit buffer
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const selectedNote = notes.find(n => n.id === selectedNoteId) || notes[0];

  useEffect(() => {
    if (selectedNote) {
      setSelectedNoteId(selectedNote.id);
      setCurrentTitle(selectedNote.title);
      setCurrentContent(selectedNote.content);
      setCurrentTags(selectedNote.tags || []);
      setHasUnsavedChanges(false);
    }
  }, [selectedNote?.id]);

  // Extract all unique tags
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags || [])));

  // Filtered notes list
  const filteredNotes = notes
    .filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            n.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag ? (n.tags || []).includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (a.pinned === b.pinned) {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return a.pinned ? -1 : 1;
    });

  const handleCreateNew = async () => {
    const newNote = await onAddNote({
      title: 'New Workspace Note',
      content: `# New Workspace Note\n\nStart typing your corporate notes, meeting agendas, or technical specs here...`,
      tags: ['VASUP'],
      pinned: false
    });
    setSelectedNoteId(newNote.id);
  };

  const handleSave = async () => {
    if (!selectedNoteId) return;
    await onUpdateNote(selectedNoteId, {
      title: currentTitle,
      content: currentContent,
      tags: currentTags
    });
    setHasUnsavedChanges(false);
  };

  const handleTogglePin = async (note: Note) => {
    await onUpdateNote(note.id, { pinned: !note.pinned });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '');
      if (!currentTags.includes(cleanTag)) {
        const updated = [...currentTags, cleanTag];
        setCurrentTags(updated);
        setHasUnsavedChanges(true);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = currentTags.filter(t => t !== tagToRemove);
    setCurrentTags(updated);
    setHasUnsavedChanges(true);
  };

  const handleCopyNote = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await onDeleteNote(id);
      const remaining = notes.filter(n => n.id !== id);
      if (remaining.length > 0) {
        setSelectedNoteId(remaining[0].id);
      }
    }
  };

  // Helper to render simple markdown formatting
  const renderMarkdownPreview = (text: string) => {
    if (!text) return <p className="text-slate-500 italic">No content</p>;
    
    return (
      <div className="prose prose-invert prose-emerald max-w-none text-slate-200 text-sm space-y-3 font-sans leading-relaxed">
        {text.split('\n\n').map((block, idx) => {
          if (block.startsWith('# ')) {
            return <h1 key={idx} className="text-2xl font-bold text-white border-b border-slate-800 pb-2">{block.slice(2)}</h1>;
          }
          if (block.startsWith('## ')) {
            return <h2 key={idx} className="text-xl font-bold text-emerald-400 mt-4 mb-2">{block.slice(3)}</h2>;
          }
          if (block.startsWith('### ')) {
            return <h3 key={idx} className="text-base font-semibold text-teal-300 mt-3 mb-1">{block.slice(4)}</h3>;
          }
          if (block.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-4 border-emerald-500 pl-3 italic text-slate-400 bg-slate-900/50 py-1.5 rounded-r-lg">
                {block.slice(2)}
              </blockquote>
            );
          }
          if (block.startsWith('- ') || block.startsWith('* ')) {
            return (
              <ul key={idx} className="list-disc list-inside space-y-1 pl-2">
                {block.split('\n').map((li, i) => (
                  <li key={i} className="text-slate-300">
                    {li.replace(/^[-*]\s+/, '')}
                  </li>
                ))}
              </ul>
            );
          }
          if (block.startsWith('```')) {
            const lines = block.split('\n');
            const code = lines.slice(1, -1).join('\n') || lines.slice(1).join('\n');
            return (
              <pre key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                <code>{code}</code>
              </pre>
            );
          }
          return <p key={idx} className="whitespace-pre-wrap">{block}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
      
      {/* Sidebar / Note Explorer */}
      <div className="lg:col-span-4 flex flex-col glass-panel rounded-2xl p-4 border border-slate-800 space-y-4">
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-white text-base">Notes &amp; Docs</h2>
          </div>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes & content..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Tag Pills */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pb-2 border-b border-slate-800/60 text-xs">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                selectedTag === null
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              All ({notes.length})
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Note List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[500px]">
          {filteredNotes.map(note => {
            const isSelected = note.id === selectedNoteId;
            return (
              <div
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`p-3.5 rounded-xl cursor-pointer border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500/50 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className={`text-xs font-semibold line-clamp-1 ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                    {note.title || 'Untitled Note'}
                  </h3>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePin(note);
                    }}
                    className={`p-1 rounded hover:bg-slate-800 ${
                      note.pinned ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                    }`}
                    title={note.pinned ? 'Unpin' : 'Pin note to top'}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                  {note.content.replace(/[#*`_>]/g, '')}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/40 font-mono">
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1">
                    {(note.tags || []).slice(0, 2).map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredNotes.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-500">
              No notes found. Click &ldquo;New Note&rdquo; to create one.
            </div>
          )}
        </div>
      </div>

      {/* Editor & Viewer Area */}
      <div className="lg:col-span-8 flex flex-col glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        {selectedNote ? (
          <>
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              
              {/* Title input */}
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => {
                  setCurrentTitle(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Note Title..."
                className="flex-1 bg-transparent text-lg font-bold text-white placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-emerald-500 transition-colors"
              />

              {/* View mode switcher & Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                
                {/* View switcher */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
                  <button
                    onClick={() => setViewMode('edit')}
                    className={`px-2 py-1 rounded font-medium transition-colors ${
                      viewMode === 'edit' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Editor only"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('split')}
                    className={`px-2 py-1 rounded font-medium transition-colors ${
                      viewMode === 'split' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Split view"
                  >
                    Split
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`px-2 py-1 rounded font-medium transition-colors ${
                      viewMode === 'preview' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Preview only"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Copy Markdown */}
                <button
                  onClick={handleCopyNote}
                  className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
                  title="Copy Note Markdown"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {/* Download note (.md or .txt) */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden text-xs">
                  <button
                    onClick={() => onDownloadNote(selectedNote.id, 'md')}
                    className="px-2.5 py-1.5 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 font-mono transition-colors flex items-center gap-1"
                    title="Download as Markdown (.md)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>.md</span>
                  </button>
                  <button
                    onClick={() => onDownloadNote(selectedNote.id, 'txt')}
                    className="px-2 py-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 font-mono border-l border-slate-800 transition-colors"
                    title="Download as Plain Text (.txt)"
                  >
                    .txt
                  </button>
                </div>

                {/* Save button */}
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
                    hasUnsavedChanges
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 ring-2 ring-emerald-500/40 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title="Save Note changes"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{hasUnsavedChanges ? 'Save Changes' : 'Saved'}</span>
                </button>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(selectedNote.id)}
                  className="p-2 text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-red-950/40 border border-slate-800 rounded-lg transition-colors"
                  title="Delete Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>

            {/* Tag bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              {currentTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 text-[11px] font-mono"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-400 font-bold"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="+ Add tag (Enter)"
                className="bg-transparent text-xs text-slate-300 placeholder-slate-600 focus:outline-none border-b border-dashed border-slate-800 focus:border-emerald-500 py-0.5 px-1"
              />
            </div>

            {/* Note Content (Edit / Preview / Split) */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[420px]">
              {(viewMode === 'edit' || viewMode === 'split') && (
                <div className={viewMode === 'edit' ? 'col-span-full h-full' : 'h-full'}>
                  <textarea
                    value={currentContent}
                    onChange={(e) => {
                      setCurrentContent(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="Write markdown here..."
                    className="w-full h-full min-h-[420px] bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              )}

              {(viewMode === 'preview' || viewMode === 'split') && (
                <div className={`${viewMode === 'preview' ? 'col-span-full' : ''} bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 overflow-y-auto max-h-[500px]`}>
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800/60 pb-1">
                    Markdown Live Preview
                  </div>
                  {renderMarkdownPreview(currentContent)}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 py-16 text-center">
            <FileText className="w-12 h-12 text-slate-700 mb-3" />
            <p className="text-sm font-semibold text-slate-400">No note selected</p>
            <p className="text-xs text-slate-600 max-w-sm mt-1 mb-4">
              Select a note from the left sidebar or create a new one to start writing.
            </p>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl"
            >
              Create New Note
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
