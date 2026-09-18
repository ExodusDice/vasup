import React, { useState } from 'react';
import { Settings, User, Laptop, Monitor, Download, Upload, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { Profile } from '../types';

interface WorkspaceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onUpdateProfile: (p: Partial<Profile>) => Promise<Profile>;
  onDownloadBackup: () => void;
  onRestoreBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetWorkspace: () => void;
}

export const WorkspaceSettingsModal: React.FC<WorkspaceSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onDownloadBackup,
  onRestoreBackup,
  onResetWorkspace
}) => {
  const [userName, setUserName] = useState(profile.userName || '');
  const [workspaceName, setWorkspaceName] = useState(profile.workspaceName || '');
  const [pcName, setPcName] = useState(profile.pcName || '');
  const [notebookId, setNotebookId] = useState(profile.corporateNotebookId || '');
  const [saved, setSaved] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile({
      userName,
      workspaceName,
      pcName,
      corporateNotebookId: notebookId
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Workspace &amp; Device Settings</h3>
              <p className="text-xs text-slate-400">Configure your PC and Corporate Notebook integration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>

        {/* Profile Configuration Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">User / Owner Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Workspace Title</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Personal PC Hostname</label>
              <input
                type="text"
                value={pcName}
                onChange={(e) => setPcName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Corporate Notebook ID</label>
              <input
                type="text"
                value={notebookId}
                onChange={(e) => setNotebookId(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">Domain: vasup.franktest.xyz</span>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
            >
              {saved ? <Check className="w-4 h-4" /> : null}
              <span>{saved ? 'Saved!' : 'Save Settings'}</span>
            </button>
          </div>
        </form>

        {/* Data & Backup Section */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 block">Workspace Data &amp; Backup</span>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={onDownloadBackup}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400 transition-colors text-center"
            >
              <Download className="w-4 h-4 mb-1 text-emerald-400" />
              <span className="font-semibold">Export JSON</span>
              <span className="text-[10px] text-slate-500">Download backup</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-blue-400 transition-colors text-center"
            >
              <Upload className="w-4 h-4 mb-1 text-blue-400" />
              <span className="font-semibold">Import JSON</span>
              <span className="text-[10px] text-slate-500">Restore backup</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onRestoreBackup}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => {
                if (confirm('Reset workspace to initial sample data? All custom edits will be reverted.')) {
                  onResetWorkspace();
                  onClose();
                }
              }}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/40 text-slate-300 hover:text-red-400 transition-colors text-center"
            >
              <RotateCcw className="w-4 h-4 mb-1 text-red-400" />
              <span className="font-semibold">Reset</span>
              <span className="text-[10px] text-slate-500">Reset default</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
