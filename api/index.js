import express from 'express';
import cors from 'cors';
import os from 'os';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// In-memory / serverless fallback storage
let workspaceData = {
  profile: {
    userName: "Frank",
    workspaceName: "VASUP In-House & WFH Workspace",
    pcName: "WFH-Home-PC",
    corporateNotebookId: "VASUP-InHouse-NB01",
    activeDevice: "WFH (Home PC)"
  },
  notes: [
    {
      id: "note-1",
      title: "WFH ↔ VASUP In-House Office Integration Guide",
      content: `# WFH (Home PC) ↔ VASUP In-House Office Hub\n\nThis workspace bridges your **Work From Home (WFH)** setup with the **VASUP In-House Office** environment.\n\n### Daily WFH Workflow:\n1. **VPN & Access**: Launch your In-House VPN or Remote Gateway from the Quick Portals tab.\n2. **Cross-Device Drops**: Transfer meeting links, credentials, tokens, or scripts between your Home PC and In-House Notebook.\n3. **CRUD Controls**: Save, Edit, Download as Markdown/Text, and Delete any document or task.\n4. **In-House Standup**: Log daily tasks and export standup summaries for the office team.\n\n> *Pro Tip*: Use \`Ctrl+K\` anywhere to search notes, tasks, or trigger quick actions!`,
      tags: ["WFH", "In-House", "VASUP", "Guide"],
      pinned: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: "note-2",
      title: "In-House Office Network & VPN Configuration",
      content: `## In-House Office Network Config\n\n- **Office Gateway**: \`vpn.vasup.office\`\n- **Intranet Domain**: \`vasup.franktest.xyz\` / \`vasup.franktest.com\`\n- **Remote Desktop / SSH Port**: \`3389\` / \`22\`\n- **In-House File Share**: Accessible via the Sync Hub Drop Zone.\n\n### Environment Sync Checklist:\n- [x] WFH Home PC Connected\n- [ ] In-House Corporate Notebook Connected\n- [ ] Daily Standup Updated`,
      tags: ["In-House", "VPN", "Network"],
      pinned: true,
      updatedAt: new Date().toISOString()
    }
  ],
  tasks: [
    {
      id: "task-1",
      title: "Establish WFH to In-House Office Connection",
      description: "Verify VPN tunnel, file sync, and clipboard drops between Home PC and VASUP In-House Notebook.",
      status: "done",
      priority: "urgent",
      device: "Both",
      tags: ["WFH", "In-House", "Core"],
      dueDate: "2026-09-20",
      createdAt: new Date().toISOString()
    },
    {
      id: "task-2",
      title: "Sync In-House Corporate Notebook Files & Documents",
      description: "Drop necessary project documents and repositories for remote work.",
      status: "in_progress",
      priority: "high",
      device: "In-House Office",
      tags: ["In-House", "Files"],
      dueDate: "2026-09-21",
      createdAt: new Date().toISOString()
    },
    {
      id: "task-3",
      title: "Prepare In-House Weekly Standup & Progress Report",
      description: "Summarize WFH activities and deliver progress report to the office team.",
      status: "to_do",
      priority: "medium",
      device: "WFH (Home PC)",
      tags: ["Standup", "Meeting"],
      dueDate: "2026-09-25",
      createdAt: new Date().toISOString()
    }
  ],
  syncDrops: [
    {
      id: "drop-1",
      type: "code",
      title: "In-House Office VPN / SSH Connect Command",
      content: `ssh -N -L 3001:localhost:3001 -L 5173:localhost:5173 frank@vasup-office-gateway`,
      sourceDevice: "WFH (Home PC)",
      createdAt: new Date().toISOString()
    },
    {
      id: "drop-2",
      type: "link",
      title: "In-House Daily Meeting Room",
      content: "https://meet.vasup.corporate/in-house-daily-sync",
      sourceDevice: "In-House Office",
      createdAt: new Date().toISOString()
    }
  ],
  files: [],
  bookmarks: [
    {
      id: "bm-1",
      title: "VASUP In-House Intranet Portal",
      url: "https://portal.vasup.corporate",
      category: "In-House Office",
      icon: "Building2",
      color: "emerald"
    },
    {
      id: "bm-2",
      title: "Office VPN / Remote Gateway",
      url: "https://vpn.vasup.corporate",
      category: "In-House Office",
      icon: "Server",
      color: "blue"
    },
    {
      id: "bm-3",
      title: "Corporate Mail / Outlook",
      url: "https://outlook.office.com",
      category: "In-House Office",
      icon: "Mail",
      color: "purple"
    },
    {
      id: "bm-4",
      title: "GitHub / GitLab Repository",
      url: "https://github.com",
      category: "Development",
      icon: "Code2",
      color: "teal"
    }
  ],
  activities: [
    {
      id: "act-1",
      time: "13:30",
      description: "WFH ↔ In-House Office Workspace connected and synchronized",
      type: "system"
    }
  ]
};

// Routes
app.get('/api/workspace', (req, res) => {
  res.json({
    ...workspaceData,
    systemInfo: {
      hostname: "Vercel-Cloud",
      platform: "Serverless",
      arch: "Cloud",
      networkAddresses: [],
      port: 443,
      clientPort: 443
    }
  });
});

app.get('/api/workspace/backup', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=vasup-workspace-backup-${new Date().toISOString().slice(0,10)}.json`);
  res.send(JSON.stringify(workspaceData, null, 2));
});

app.post('/api/workspace/restore', (req, res) => {
  const newDb = req.body;
  if (!newDb || typeof newDb !== 'object') return res.status(400).json({ error: 'Invalid backup' });
  workspaceData = newDb;
  res.json({ success: true, data: workspaceData });
});

app.post('/api/notes', (req, res) => {
  const newNote = {
    id: `note-${Date.now()}`,
    title: req.body.title || 'Untitled Note',
    content: req.body.content || '',
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    pinned: Boolean(req.body.pinned),
    updatedAt: new Date().toISOString()
  };
  workspaceData.notes.unshift(newNote);
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
  const index = workspaceData.notes.findIndex(n => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Note not found' });
  workspaceData.notes[index] = { ...workspaceData.notes[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(workspaceData.notes[index]);
});

app.delete('/api/notes/:id', (req, res) => {
  workspaceData.notes = workspaceData.notes.filter(n => n.id !== req.params.id);
  res.json({ success: true });
});

app.get('/api/notes/:id/download', (req, res) => {
  const note = workspaceData.notes.find(n => n.id === req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  const format = req.query.format || 'md';
  const safeTitle = note.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'note';
  res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.${format}"`);
  res.setHeader('Content-Type', format === 'md' ? 'text/markdown' : 'text/plain');
  res.send(note.content);
});

app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: `task-${Date.now()}`,
    title: req.body.title || 'New Task',
    description: req.body.description || '',
    status: req.body.status || 'to_do',
    priority: req.body.priority || 'medium',
    device: req.body.device || 'Both',
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    dueDate: req.body.dueDate || '',
    createdAt: new Date().toISOString()
  };
  workspaceData.tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const index = workspaceData.tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  workspaceData.tasks[index] = { ...workspaceData.tasks[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(workspaceData.tasks[index]);
});

app.delete('/api/tasks/:id', (req, res) => {
  workspaceData.tasks = workspaceData.tasks.filter(t => t.id !== req.params.id);
  res.json({ success: true });
});

app.post('/api/sync/drops', (req, res) => {
  const newDrop = {
    id: `drop-${Date.now()}`,
    title: req.body.title || 'Quick Drop',
    content: req.body.content || '',
    type: req.body.type || 'text',
    sourceDevice: req.body.sourceDevice || 'WFH (Home PC)',
    createdAt: new Date().toISOString()
  };
  workspaceData.syncDrops.unshift(newDrop);
  res.status(201).json(newDrop);
});

app.put('/api/sync/drops/:id', (req, res) => {
  const index = workspaceData.syncDrops.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Drop not found' });
  workspaceData.syncDrops[index] = { ...workspaceData.syncDrops[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(workspaceData.syncDrops[index]);
});

app.delete('/api/sync/drops/:id', (req, res) => {
  workspaceData.syncDrops = workspaceData.syncDrops.filter(d => d.id !== req.params.id);
  res.json({ success: true });
});

app.post('/api/bookmarks', (req, res) => {
  const newBm = {
    id: `bm-${Date.now()}`,
    title: req.body.title || 'New Link',
    url: req.body.url || 'https://',
    category: req.body.category || 'In-House Office',
    icon: req.body.icon || 'Globe',
    color: req.body.color || 'emerald'
  };
  workspaceData.bookmarks.push(newBm);
  res.status(201).json(newBm);
});

app.delete('/api/bookmarks/:id', (req, res) => {
  workspaceData.bookmarks = workspaceData.bookmarks.filter(b => b.id !== req.params.id);
  res.json({ success: true });
});

app.post('/api/activities', (req, res) => {
  const newAct = {
    id: `act-${Date.now()}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    description: req.body.description || 'Activity',
    type: req.body.type || 'custom'
  };
  workspaceData.activities.unshift(newAct);
  res.status(201).json(newAct);
});

app.delete('/api/activities/:id', (req, res) => {
  workspaceData.activities = workspaceData.activities.filter(a => a.id !== req.params.id);
  res.json({ success: true });
});

app.put('/api/profile', (req, res) => {
  workspaceData.profile = { ...workspaceData.profile, ...req.body };
  res.json(workspaceData.profile);
});

export default app;
