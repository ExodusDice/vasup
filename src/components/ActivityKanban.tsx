import React, { useState } from 'react';
import { 
  Kanban, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Laptop, 
  Monitor, 
  Layers, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { Task } from '../types';

interface ActivityKanbanProps {
  tasks: Task[];
  activeDevice: string;
  onAddTask: (task: Partial<Task>) => Promise<Task>;
  onUpdateTask: (id: string, task: Partial<Task>) => Promise<Task>;
  onDeleteTask: (id: string) => Promise<void>;
}

const COLUMNS = [
  { id: 'to_do', title: 'To Do', color: 'border-slate-700 text-slate-300 bg-slate-900/60' },
  { id: 'in_progress', title: 'In Progress', color: 'border-blue-700/60 text-blue-400 bg-blue-950/20' },
  { id: 'review', title: 'VASUP Review', color: 'border-amber-700/60 text-amber-400 bg-amber-950/20' },
  { id: 'done', title: 'Completed', color: 'border-emerald-700/60 text-emerald-400 bg-emerald-950/20' }
] as const;

export const ActivityKanban: React.FC<ActivityKanbanProps> = ({
  tasks,
  activeDevice,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<'All' | 'Personal PC' | 'Corporate Notebook'>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('to_do');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [device, setDevice] = useState<string>(activeDevice);
  const [tags, setTags] = useState<string>('');
  const [dueDate, setDueDate] = useState('');

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDevice = deviceFilter === 'All' ? true : (t.device === deviceFilter || t.device === 'Both');
    const matchesPriority = priorityFilter === 'All' ? true : t.priority === priorityFilter;
    return matchesSearch && matchesDevice && matchesPriority;
  });

  const handleOpenAddModal = (defaultStatus: Task['status'] = 'to_do') => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setStatus(defaultStatus);
    setPriority('medium');
    setDevice(activeDevice);
    setTags('');
    setDueDate('');
    setShowModal(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
    setDevice(task.device);
    setTags((task.tags || []).join(', '));
    setDueDate(task.dueDate || '');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingTask) {
      await onUpdateTask(editingTask.id, {
        title,
        description,
        status,
        priority,
        device,
        tags: parsedTags,
        dueDate
      });
    } else {
      await onAddTask({
        title,
        description,
        status,
        priority,
        device,
        tags: parsedTags,
        dueDate
      });
    }

    setShowModal(false);
  };

  const handleMoveStatus = async (task: Task, direction: 'next' | 'prev') => {
    const statusOrder: Task['status'][] = ['to_do', 'in_progress', 'review', 'done'];
    const currentIndex = statusOrder.indexOf(task.status);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < statusOrder.length) {
      await onUpdateTask(task.id, { status: statusOrder[nextIndex] });
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Device', 'Tags', 'DueDate', 'CreatedAt'];
    const rows = tasks.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.status,
      t.priority,
      t.device,
      `"${(t.tags || []).join(';')}"`,
      t.dueDate || '',
      t.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vasup-tasks-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriorityBadge = (p: Task['priority']) => {
    switch (p) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60 text-[10px] font-bold">URGENT</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/60 text-[10px] font-semibold">HIGH</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/60 text-[10px]">MED</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">LOW</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Controls & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Kanban className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Activity &amp; Task Kanban</h2>
            <p className="text-xs text-slate-400">Manage PC development &amp; VASUP corporate milestones</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Devices</option>
            <option value="Personal PC">Personal PC</option>
            <option value="Corporate Notebook">Corporate Notebook</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs transition-colors"
            title="Export tasks as CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          {/* Add Task */}
          <button
            onClick={() => handleOpenAddModal('to_do')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`rounded-2xl border p-4 flex flex-col min-h-[520px] ${col.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    {col.title}
                  </h3>
                  <span className="w-5 h-5 rounded-full bg-slate-800/90 text-slate-300 text-[11px] font-mono flex items-center justify-center">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenAddModal(col.id as Task['status'])}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                  title={`Add task to ${col.title}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks in Column */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1 max-h-[560px]">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    className="glass-card p-4 rounded-xl border border-slate-800/90 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-sm bg-slate-900/90"
                  >
                    <div>
                      {/* Priority & Device tags */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {getPriorityBadge(task.priority)}

                        <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {task.device.includes('Notebook') ? <Laptop className="w-3 h-3 text-emerald-400" /> : <Monitor className="w-3 h-3 text-blue-400" />}
                          {task.device}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h4 className="text-xs font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-3 mb-3">
                          {task.description}
                        </p>
                      )}

                      {/* Due date & Tags */}
                      <div className="flex items-center gap-2 flex-wrap mb-3 text-[10px] text-slate-500">
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3 h-3 text-emerald-400" />
                            <span>{task.dueDate}</span>
                          </div>
                        )}

                        {(task.tags || []).map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom controls: Move & Edit & Delete */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                      
                      {/* Move status buttons */}
                      <div className="flex items-center gap-1">
                        {col.id !== 'to_do' && (
                          <button
                            onClick={() => handleMoveStatus(task, 'prev')}
                            className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                            title="Move back"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            onClick={() => handleMoveStatus(task, 'next')}
                            className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                            title="Move forward"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Edit / Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(task)}
                          className="p-1 text-slate-400 hover:text-emerald-400 rounded transition-colors"
                          title="Edit Task"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this task?')) onDeleteTask(task.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-24 border border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-[11px] text-slate-600 italic">
                    Empty column
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-white">
                {editingTask ? 'Edit Task / Activity' : 'Add New Task / Activity'}
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
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Test VASUP Notebook sync & VPN connection"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details, steps, or requirements..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="to_do">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">VASUP Review</option>
                    <option value="done">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Device Environment</label>
                  <select
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Both">Both (PC &amp; Notebook)</option>
                    <option value="Personal PC">Personal PC</option>
                    <option value="Corporate Notebook">Corporate Notebook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="VASUP, Security, Dev, Meeting"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
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
                  {editingTask ? 'Save Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
