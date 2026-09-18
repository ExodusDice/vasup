import React, { useState } from 'react';
import { 
  Laptop, 
  Monitor, 
  Wifi, 
  Download, 
  Upload, 
  Search, 
  RotateCcw, 
  Settings, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { Profile, SystemInfo } from '../types';

interface NavbarProps {
  profile: Profile;
  systemInfo?: SystemInfo;
  activeDevice: string;
  onDeviceChange: (device: string) => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  onDownloadBackup: () => void;
  onRestoreBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetWorkspace: () => void;
  isSaving: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  systemInfo,
  activeDevice,
  onDeviceChange,
  onOpenCommandPalette,
  onOpenSettings,
  onDownloadBackup,
  onRestoreBackup,
  onResetWorkspace,
  isSaving
}) => {
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand & Domain */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 font-black text-lg">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-lg">VASUP</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                  vasup.franktest.xyz
                </span>
              </div>
              <p className="text-xs text-slate-400">PC &amp; Corporate Notebook Hub</p>
            </div>
          </div>

          {/* Device Switcher */}
          <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => onDeviceChange('WFH (Home PC)')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeDevice === 'WFH (Home PC)'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>WFH (Home PC)</span>
              {activeDevice === 'WFH (Home PC)' && <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />}
            </button>

            <button
              onClick={() => onDeviceChange('In-House Office')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeDevice === 'In-House Office'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>In-House (Office NB)</span>
              {activeDevice === 'In-House Office' && <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />}
            </button>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2.5">
            {/* Quick search button */}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 hover:text-slate-200 transition-colors shadow-sm"
              title="Search and commands (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
                Ctrl K
              </kbd>
            </button>

            {/* Network / Notebook Connection Modal Button */}
            <button
              onClick={() => setShowNetworkModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-lg hover:bg-emerald-900/40 transition-colors"
              title="View connection address for Corporate Notebook"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Sync Link</span>
            </button>

            {/* Download Backup */}
            <button
              onClick={onDownloadBackup}
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-900 rounded-lg border border-transparent hover:border-slate-800 transition-colors"
              title="Download Full Workspace Backup (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Upload / Restore Backup */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-900 rounded-lg border border-transparent hover:border-slate-800 transition-colors"
              title="Restore / Import Workspace (JSON)"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onRestoreBackup}
              accept=".json"
              className="hidden"
            />

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg border border-transparent hover:border-slate-800 transition-colors"
              title="Workspace Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Live save indicator */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
              {isSaving ? (
                <div className="flex items-center gap-1 text-[11px] text-amber-400">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="hidden lg:inline">Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <Check className="w-3 h-3" />
                  <span className="hidden lg:inline">Synced</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Network Connection Modal for Corporate Notebook */}
      {showNetworkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Connect Corporate Notebook</h3>
                  <p className="text-xs text-slate-400">Access this workspace on both PC and Notebook</p>
                </div>
              </div>
              <button
                onClick={() => setShowNetworkModal(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Open your browser on your <strong>VASUP Corporate Notebook</strong> (connected to the same Wi-Fi or VPN) and use any of these URLs:
              </p>

              <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Domain / DNS:</span>
                  <span className="text-emerald-400 select-all font-semibold">http://vasup.franktest.xyz:5173</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Local PC Host:</span>
                  <span className="text-emerald-400 select-all">http://localhost:5173</span>
                </div>
                {systemInfo?.networkAddresses && systemInfo.networkAddresses.map((net, i) => (
                  <div key={i} className="flex items-center justify-between py-1">
                    <span className="text-slate-400">LAN ({net.interface}):</span>
                    <span className="text-emerald-400 select-all font-semibold">http://{net.address}:5173</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-xl flex items-start gap-2.5 text-emerald-300">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <p className="text-[11px] leading-relaxed">
                  Any text snippet, file upload, note edit, or task change made on your Corporate Notebook or PC is saved and synchronized immediately.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowNetworkModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
