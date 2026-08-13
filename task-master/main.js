const { app, BrowserWindow, Notification, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let tray = null;

// Data file path for offline storage
const userDataPath = path.join(app.getPath('userData'), 'task-data.json');

// Default task templates based on your workflow
const defaultTemplates = [
  { id: 1, title: 'Email Marketing Day', description: 'Gather subscriber emails, create soap opera email sequence, send special offer emails', category: 'marketing', duration: 8 },
  { id: 2, title: 'Social Media Content Creation', description: 'Create posts for YouTube, Facebook, Instagram, TikTok, and website community', category: 'content', duration: 6 },
  { id: 3, title: 'Client Posts Generation', description: 'Create 150+ posts for clients to attract more customers', category: 'client-work', duration: 8 },
  { id: 4, title: 'Short Video Creation', description: 'Create attractive short videos about offers, deals, or intros', category: 'video', duration: 4 },
  { id: 5, title: 'Tutorial Videos', description: 'Create platform tutorials to pre-mind clients (Dotcom Secrets strategy)', category: 'video', duration: 6 },
  { id: 6, title: 'Character Development Video', description: 'Create emotional connection content with attractive character (Expert Secrets)', category: 'video', duration: 5 },
  { id: 7, title: 'Dream 100 Outreach', description: 'Research Facebook groups, connect with admins, build relationships (Traffic Secrets)', category: 'outreach', duration: 4 },
  { id: 8, title: 'Community Management', description: 'Handle messages, registrations, and community engagement across all platforms', category: 'management', duration: 3 },
  { id: 9, title: 'Book Writing Session', description: 'Write chapters about attracting clients, business strategies, and platform story', category: 'writing', duration: 3 }
];

// Load tasks from file
function loadTasks() {
  try {
    if (fs.existsSync(userDataPath)) {
      const data = fs.readFileSync(userDataPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
  return { tasks: [], calendar: {}, completed: [] };
}

// Save tasks to file
function saveTasks(data) {
  try {
    fs.writeFileSync(userDataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    return false;
  }
}

// Initialize default data if file doesn't exist
function initializeData() {
  if (!fs.existsSync(userDataPath)) {
    const initialData = {
      tasks: defaultTemplates.map(t => ({
        ...t,
        created: new Date().toISOString(),
        scheduled: null,
        priority: 'medium',
        status: 'pending'
      })),
      calendar: {},
      completed: [],
      settings: {
        notificationsEnabled: true,
        workHours: { start: 9, end: 18 },
        reminderMinutesBefore: 15
      }
    };
    saveTasks(initialData);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: 'Task Master - Your Daily Productivity Companion'
  });

  mainWindow.loadFile('index.html');
  
  // Open DevTools in development
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create system tray icon
function createTray() {
  const iconPath = path.join(__dirname, 'assets/icon.png');
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Task Master', click: () => mainWindow.show() },
    { label: 'Check Notifications', click: () => checkNotifications() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  
  tray.setToolTip('Task Master');
  tray.setContextMenu(contextMenu);
  
  tray.on('double-click', () => {
    mainWindow.show();
  });
}

// Check for due tasks and send notifications
function checkNotifications() {
  const data = loadTasks();
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  const pendingTasks = data.tasks.filter(task => {
    return task.scheduled === today && task.status === 'pending';
  });
  
  if (pendingTasks.length > 0 && data.settings.notificationsEnabled) {
    const taskList = pendingTasks.map(t => `• ${t.title}`).join('\n');
    
    new Notification({
      title: '📋 Today\'s Tasks',
      body: `You have ${pendingTasks.length} task(s) scheduled:\n\n${taskList}`,
      urgency: 'normal'
    }).show();
  }
  
  // Check for overdue tasks
  const overdueTasks = data.tasks.filter(task => {
    return task.scheduled && task.scheduled < today && task.status === 'pending';
  });
  
  if (overdueTasks.length > 0 && data.settings.notificationsEnabled) {
    new Notification({
      title: '⚠️ Overdue Tasks',
      body: `You have ${overdueTasks.length} overdue task(s)! Don't let competitors win!`,
      urgency: 'critical'
    }).show();
  }
}

// IPC Handlers
ipcMain.handle('load-tasks', () => {
  return loadTasks();
});

ipcMain.handle('save-tasks', (event, data) => {
  return saveTasks(data);
});

ipcMain.handle('add-task', (event, task) => {
  const data = loadTasks();
  task.id = Date.now();
  task.created = new Date().toISOString();
  task.status = 'pending';
  data.tasks.push(task);
  saveTasks(data);
  return data;
});

ipcMain.handle('update-task', (event, taskId, updates) => {
  const data = loadTasks();
  const taskIndex = data.tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...updates };
    saveTasks(data);
  }
  return data;
});

ipcMain.handle('delete-task', (event, taskId) => {
  const data = loadTasks();
  data.tasks = data.tasks.filter(t => t.id !== taskId);
  saveTasks(data);
  return data;
});

ipcMain.handle('complete-task', (event, taskId) => {
  const data = loadTasks();
  const taskIndex = data.tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    data.tasks[taskIndex].status = 'completed';
    data.tasks[taskIndex].completedAt = new Date().toISOString();
    data.completed.push({
      taskId: taskId,
      completedAt: new Date().toISOString()
    });
    saveTasks(data);
  }
  return data;
});

ipcMain.handle('get-today-tasks', () => {
  const data = loadTasks();
  const today = new Date().toISOString().split('T')[0];
  return data.tasks.filter(task => task.scheduled === today);
});

ipcMain.handle('send-notification', (event, options) => {
  new Notification(options).show();
  return true;
});

ipcMain.handle('check-notifications', () => {
  checkNotifications();
  return true;
});

app.whenReady(() => {
  initializeData();
  createWindow();
  createTray();
  
  // Check notifications every hour
  setInterval(checkNotifications, 3600000);
  
  // Check notifications on startup
  setTimeout(checkNotifications, 5000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
