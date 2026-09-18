import React, { useState } from 'react';
import { 
  Rocket, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  Globe, 
  Building2, 
  Mail, 
  Code2, 
  Server, 
  Terminal,
  FolderSync
} from 'lucide-react';
import { Bookmark } from '../types';

interface QuickLaunchpadProps {
  bookmarks: Bookmark[];
  onAddBookmark: (bm: Partial<Bookmark>) => Promise<Bookmark>;
  onUpdateBookmark: (id: string, bm: Partial<Bookmark>) => Promise<Bookmark>;
  onDeleteBookmark: (id: string) => Promise<void>;
}

export const QuickLaunchpad: React.FC<QuickLaunchpadProps> = ({
  bookmarks,
  onAddBookmark,
  onUpdateBookmark,
  onDeleteBookmark
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingBm, setEditingBm] = useState<Bookmark | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Corporate');
  const [icon, setIcon] = useState('Globe');
  const [color, setColor] = useState('emerald');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = Array.from(new Set(bookmarks.map(b => b.category)));

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAdd = () => {
    setEditingBm(null);
    setTitle('');
    setUrl('https://');
    setCategory('Corporate');
    setIcon('Globe');
    setColor('emerald');
    setShowModal(true);
  };

  const handleOpenEdit = (bm: Bookmark) => {
    setEditingBm(bm);
    setTitle(bm.title);
    setUrl(bm.url);
    setCategory(bm.category);
    setIcon(bm.icon);
    setColor(bm.color || 'emerald');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    if (editingBm) {
      await onUpdateBookmark(editingBm.id, { title, url, category, icon, color });
    } else {
      await onAddBookmark({ title, url, category, icon, color });
    }

    setShowModal(false);
  };

  const getIconElement = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-5 h-5" />;
      case 'Mail': return <Mail className="w-5 h-5" />;
      case 'Code2': return <Code2 className="w-5 h-5" />;
      case 'Server': return <Server className="w-5 h-5" />;
      case 'Terminal': return <Terminal className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Quick Launchpad &amp; Portals</h2>
            <p className="text-xs text-slate-400">One-click bookmarks to VASUP corporate tools, VPN portals, and PC dev links</p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Bookmark</span>
        </button>
      </div>

      {/* Grouped by Categories */}
      {categories.map(cat => {
        const catItems = bookmarks.filter(b => b.category === cat);
        return (
          <div key={cat} className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              {cat}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {catItems.map(bm => (
                <div
                  key={bm.id}
                  className="glass-card p-4 rounded-xl border border-slate-800/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 border border-slate-800 group-hover:border-emerald-500/30 transition-colors">
                        {getIconElement(bm.icon)}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(bm)}
                          className="p-1 text-slate-400 hover:text-white rounded"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete bookmark?')) onDeleteBookmark(bm.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-400 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xs font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                      {bm.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono line-clamp-1">
                      {bm.url}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60">
                    <button
                      onClick={() => handleCopyUrl(bm.url, bm.id)}
                      className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono"
                      title="Copy URL"
                    >
                      {copiedId === bm.id ? (
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

                    <a
                      href={bm.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 rounded-lg text-xs font-semibold transition-all border border-emerald-500/20"
                    >
                      <span>Launch</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-white">
                {editingBm ? 'Edit Bookmark' : 'Add Launch Bookmark'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. VASUP VPN Portal"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Corporate / Dev"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Icon</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Globe">Globe</option>
                    <option value="Building2">Building / Corporate</option>
                    <option value="Mail">Mail</option>
                    <option value="Code2">Code</option>
                    <option value="Server">Server</option>
                    <option value="Terminal">Terminal</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-colors shadow-md shadow-emerald-500/20"
                >
                  {editingBm ? 'Save Changes' : 'Add Bookmark'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
