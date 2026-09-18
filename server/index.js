import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const DB_FILE = path.join(DATA_DIR, 'workspace.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Static uploads serving
app.use('/uploads', express.static(UPLOADS_DIR));

// Serve production frontend if built
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Sanitize original name
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({ storage });

// Default Workspace State
const defaultWorkspaceData = {
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

// Helper to load DB
function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultWorkspaceData, null, 2), 'utf-8');
      return defaultWorkspaceData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB:', err);
    return defaultWorkspaceData;
  }
}

// Helper to save DB
function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

// Get network IPs for easy notebook access
function getNetworkAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push({ interface: name, address: net.address });
      }
    }
  }
  return addresses;
}

// === ROUTES ===

// 1. Get entire workspace state
app.get('/api/workspace', (req, res) => {
  const db = loadDB();
  const network = getNetworkAddresses();
  res.json({
    ...db,
    systemInfo: {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      networkAddresses: network,
      port: PORT,
      clientPort: 5173
    }
  });
});

// 2. Full Workspace Backup & Restore (Save/Download/Delete/Import)
app.get('/api/workspace/backup', (req, res) => {
  const db = loadDB();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=vasup-workspace-backup-${new Date().toISOString().slice(0,10)}.json`);
  res.send(JSON.stringify(db, null, 2));
});

app.post('/api/workspace/restore', (req, res) => {
  const newDb = req.body;
  if (!newDb || typeof newDb !== 'object') {
    return res.status(400).json({ error: 'Invalid backup JSON' });
  }
  saveDB(newDb);
  res.json({ success: true, message: 'Workspace restored successfully', data: newDb });
});

app.post('/api/workspace/reset', (req, res) => {
  saveDB(defaultWorkspaceData);
  res.json({ success: true, message: 'Workspace reset to default', data: defaultWorkspaceData });
});

// 3. Notes CRUD
app.post('/api/notes', (req, res) => {
  const db = loadDB();
  const { title, content, tags, pinned } = req.body;
  const newNote = {
    id: `note-${Date.now()}`,
    title: title || 'Untitled Note',
    content: content || '',
    tags: Array.isArray(tags) ? tags : [],
    pinned: Boolean(pinned),
    updatedAt: new Date().toISOString()
  };
  db.notes.unshift(newNote);
  saveDB(db);
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const index = db.notes.findIndex(n => n.id === id);
  if (index === -1) return res.status(404).json({ error: 'Note not found' });

  db.notes[index] = {
    ...db.notes[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  saveDB(db);
  res.json(db.notes[index]);
});

app.delete('/api/notes/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.notes = db.notes.filter(n => n.id !== id);
  saveDB(db);
  res.json({ success: true, id });
});

app.get('/api/notes/:id/download', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const format = req.query.format || 'md';
  const note = db.notes.find(n => n.id === id);
  if (!note) return res.status(404).json({ error: 'Note not found' });

  const safeTitle = note.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'note';
  res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.${format}"`);
  res.setHeader('Content-Type', format === 'md' ? 'text/markdown' : 'text/plain');
  res.send(note.content);
});

// 4. Tasks CRUD
app.post('/api/tasks', (req, res) => {
  const db = loadDB();
  const { title, description, status, priority, device, tags, dueDate } = req.body;
  const newTask = {
    id: `task-${Date.now()}`,
    title: title || 'New Task',
    description: description || '',
    status: status || 'to_do',
    priority: priority || 'medium',
    device: device || 'Both',
    tags: Array.isArray(tags) ? tags : [],
    dueDate: dueDate || '',
    createdAt: new Date().toISOString()
  };
  db.tasks.push(newTask);
  saveDB(db);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const index = db.tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  db.tasks[index] = {
    ...db.tasks[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  saveDB(db);
  res.json(db.tasks[index]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.tasks = db.tasks.filter(t => t.id !== id);
  saveDB(db);
  res.json({ success: true, id });
});

// 5. Sync Drops (Clipboard / Snippets / Text) CRUD
app.post('/api/sync/drops', (req, res) => {
  const db = loadDB();
  const { title, content, type, sourceDevice } = req.body;
  const newDrop = {
    id: `drop-${Date.now()}`,
    title: title || 'Quick Drop',
    content: content || '',
    type: type || 'text',
    sourceDevice: sourceDevice || 'Personal PC',
    createdAt: new Date().toISOString()
  };
  db.syncDrops.unshift(newDrop);
  saveDB(db);
  res.status(201).json(newDrop);
});

app.put('/api/sync/drops/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const index = db.syncDrops.findIndex(d => d.id === id);
  if (index === -1) return res.status(404).json({ error: 'Drop not found' });

  db.syncDrops[index] = {
    ...db.syncDrops[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  saveDB(db);
  res.json(db.syncDrops[index]);
});

app.delete('/api/sync/drops/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.syncDrops = db.syncDrops.filter(d => d.id !== id);
  saveDB(db);
  res.json({ success: true, id });
});

// 6. Cross-Device File Transfer (Upload, Download, Delete)
app.post('/api/sync/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const db = loadDB();
  const fileMeta = {
    id: `file-${Date.now()}`,
    originalName: req.file.originalname,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
    uploadedFrom: req.body.sourceDevice || 'Personal PC',
    uploadedAt: new Date().toISOString(),
    downloadUrl: `/api/sync/download/${req.file.filename}`
  };
  if (!Array.isArray(db.files)) db.files = [];
  db.files.unshift(fileMeta);
  saveDB(db);
  res.status(201).json(fileMeta);
});

app.get('/api/sync/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found on server' });
  }
  res.download(filePath);
});

app.delete('/api/sync/files/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const fileItem = (db.files || []).find(f => f.id === id);
  if (fileItem) {
    const filePath = path.join(UPLOADS_DIR, fileItem.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error deleting file on disk:', err);
      }
    }
  }
  db.files = (db.files || []).filter(f => f.id !== id);
  saveDB(db);
  res.json({ success: true, id });
});

// 7. Bookmarks CRUD
app.post('/api/bookmarks', (req, res) => {
  const db = loadDB();
  const { title, url, category, icon, color } = req.body;
  const newBm = {
    id: `bm-${Date.now()}`,
    title: title || 'New Link',
    url: url || 'https://',
    category: category || 'General',
    icon: icon || 'Globe',
    color: color || 'emerald'
  };
  db.bookmarks.push(newBm);
  saveDB(db);
  res.status(201).json(newBm);
});

app.put('/api/bookmarks/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const index = db.bookmarks.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: 'Bookmark not found' });

  db.bookmarks[index] = { ...db.bookmarks[index], ...req.body };
  saveDB(db);
  res.json(db.bookmarks[index]);
});

app.delete('/api/bookmarks/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.bookmarks = db.bookmarks.filter(b => b.id !== id);
  saveDB(db);
  res.json({ success: true, id });
});

// 8. Activities / Logs
app.post('/api/activities', (req, res) => {
  const db = loadDB();
  const { description, type } = req.body;
  const newAct = {
    id: `act-${Date.now()}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    description: description || 'New Activity',
    type: type || 'custom'
  };
  if (!Array.isArray(db.activities)) db.activities = [];
  db.activities.unshift(newAct);
  saveDB(db);
  res.status(201).json(newAct);
});

app.delete('/api/activities/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.activities = (db.activities || []).filter(a => a.id !== id);
  saveDB(db);
  res.json({ success: true, id });
});

// Profile update
app.put('/api/profile', (req, res) => {
  const db = loadDB();
  db.profile = { ...db.profile, ...req.body };
  saveDB(db);
  res.json(db.profile);
});

// Wildcard fallback for SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('VASUP Workspace API running. Build frontend with npm run build.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`VASUP Workspace API Server running on port ${PORT}`);
  console.log(`Accessible locally: http://localhost:${PORT}`);
  const addrs = getNetworkAddresses();
  addrs.forEach(a => {
    console.log(`Accessible from Corporate Notebook / LAN: http://${a.address}:${PORT}`);
  });
});
