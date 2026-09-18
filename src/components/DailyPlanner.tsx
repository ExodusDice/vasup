import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Download, 
  FileText,
  ListTodo
} from 'lucide-react';
import { Activity } from '../types';

interface DailyPlannerProps {
  activities: Activity[];
  onAddActivity: (activity: { description: string; type?: string }) => Promise<Activity>;
  onDeleteActivity: (id: string) => Promise<void>;
}

export const DailyPlanner: React.FC<DailyPlannerProps> = ({
  activities,
  onAddActivity,
  onDeleteActivity
}) => {
  // Focus Timer (Pomodoro)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');

  // Activity Logger
  const [newLog, setNewLog] = useState('');

  // Daily Standup Checklist
  const [standupNotes, setStandupNotes] = useState({
    yesterday: 'Configured VASUP workspace network and device endpoints.',
    today: 'Sync Corporate Notebook documents and test live file drop.',
    blockers: 'None currently.'
  });

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsRunning(false);
      // Mode switch
      if (timerMode === 'work') {
        alert('Work session finished! Time for a break.');
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        alert('Break ended! Ready to focus?');
        setTimerMode('work');
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds, timerMode]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = (mins = 25) => {
    setIsRunning(false);
    setTimerSeconds(mins * 60);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.trim()) return;
    await onAddActivity({ description: newLog, type: 'manual' });
    setNewLog('');
  };

  const handleExportDailyReport = () => {
    const content = `# VASUP Daily Workspace Summary - ${new Date().toLocaleDateString()}

## Daily Standup Notes
- **Yesterday**: ${standupNotes.yesterday}
- **Today**: ${standupNotes.today}
- **Blockers**: ${standupNotes.blockers}

## Activity Timeline Log
${activities.map(a => `- [${a.time}] ${a.description}`).join('\n')}

---
*Exported from vasup.franktest.xyz*
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vasup-daily-report-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Pomodoro Focus Timer & Standup Notes */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Focus Timer Widget */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Flame className="w-4 h-4" />
            <span>Focus Session</span>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs mb-6 mt-6">
            <button
              onClick={() => {
                setTimerMode('work');
                resetTimer(25);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                timerMode === 'work' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Focus (25m)
            </button>
            <button
              onClick={() => {
                setTimerMode('break');
                resetTimer(5);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                timerMode === 'break' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Short Break (5m)
            </button>
          </div>

          {/* Large Clock Display */}
          <div className="font-mono text-5xl font-extrabold text-white tracking-wider my-3 drop-shadow-md">
            {formatTimer(timerSeconds)}
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
            </button>

            <button
              onClick={() => resetTimer(timerMode === 'work' ? 25 : 5)}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Daily Standup Notes (Editable) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              <ListTodo className="w-4 h-4 text-emerald-400" />
              <span>Daily Standup / Agenda</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Editable</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1 font-medium">1. Yesterday Completed</label>
              <textarea
                rows={2}
                value={standupNotes.yesterday}
                onChange={(e) => setStandupNotes({ ...standupNotes, yesterday: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1 font-medium">2. Today's Plan</label>
              <textarea
                rows={2}
                value={standupNotes.today}
                onChange={(e) => setStandupNotes({ ...standupNotes, today: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1 font-medium">3. Blockers &amp; Help Needed</label>
              <input
                type="text"
                value={standupNotes.blockers}
                onChange={(e) => setStandupNotes({ ...standupNotes, blockers: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Activity Timeline & Logging */}
      <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
        
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Activity Timeline Log</h3>
                <p className="text-xs text-slate-400">Track and timestamp your daily corporate milestones</p>
              </div>
            </div>

            <button
              onClick={handleExportDailyReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs transition-colors"
              title="Download Daily Report as Markdown"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Report</span>
            </button>
          </div>

          {/* Quick Add Log */}
          <form onSubmit={handleAddLog} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newLog}
              onChange={(e) => setNewLog(e.target.value)}
              placeholder="Log an activity (e.g. Deployed backend, Finished VASUP sync testing)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
            >
              Log
            </button>
          </form>

          {/* Timeline List */}
          <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700/80 shrink-0">
                    {act.time}
                  </span>
                  <p className="text-xs text-slate-200 mt-0.5">{act.description}</p>
                </div>

                <button
                  onClick={() => onDeleteActivity(act.id)}
                  className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {activities.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500">
                No activity logs recorded today yet.
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/60 text-xs text-slate-500 flex items-center justify-between font-mono">
          <span>Today: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
          <span>{activities.length} entries recorded</span>
        </div>

      </div>

    </div>
  );
};
