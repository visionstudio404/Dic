// Focus Alert System - Background Service Worker

let youtubeStartTime = null;
let youtubeAlertSent = false;
let checkInterval = null;

// Motivational messages for YouTube distraction
const motivationalMessages = [
  "Your book won't write itself. Close YouTube and create!",
  "Future you will thank present you for staying focused.",
  "Every minute on YouTube is a minute away from your goals.",
  "Your audience is waiting for your content, not your YouTube binge!",
  "Close YouTube. Write that chapter. Create that post.",
  "Remember why you started. Get back to work!",
  "Your anime episode will still be there after you finish your task.",
  "Success is built in moments like this. Choose wisely.",
  "30 minutes gone. What have you created today?",
  "Your brand needs you focused. Close YouTube now!"
];

// Initialize alarms on startup
chrome.runtime.onInstalled.addListener(() => {
  console.log('Focus Alert System installed');
  initializeAlarms();
});

// Initialize all alarms from storage
async function initializeAlarms() {
  const data = await chrome.storage.local.get(['tasks', 'youtubeEnabled']);
  
  if (data.tasks) {
    data.tasks.forEach(task => {
      if (task.enabled) {
        scheduleTask(task);
      }
    });
  }
  
  // Start YouTube monitoring if enabled
  if (data.youtubeEnabled !== false) {
    startYoutubeMonitoring();
  }
}

// Schedule a task based on its type
function scheduleTask(task) {
  const alarmName = `task-${task.id}`;
  
  if (task.type === 'random_interval') {
    // For random interval tasks (20-40 minutes)
    const nextTime = getRandomTime(20, 40);
    chrome.alarms.create(alarmName, {
      delayInMinutes: nextTime
    });
  } else if (task.type === 'specific_time') {
    // For specific time alerts (anime episodes, etc.)
    const now = new Date();
    const taskTime = new Date(task.scheduledTime);
    
    if (taskTime > now) {
      chrome.alarms.create(alarmName, {
        when: taskTime.getTime()
      });
    }
  } else if (task.type === 'interval') {
    // For regular interval tasks
    chrome.alarms.create(alarmName, {
      periodInMinutes: task.intervalMinutes
    });
  }
}

// Get random time between min and max minutes
function getRandomTime(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Handle alarm triggers
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name.startsWith('task-')) {
    const taskId = alarm.name.replace('task-', '');
    const data = await chrome.storage.local.get(['tasks']);
    const task = data.tasks?.find(t => t.id === taskId);
    
    if (task) {
      // Send notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: task.title,
        message: task.message || `Time to ${task.title}!`,
        priority: 2
      });
      
      // Reschedule if needed
      if (task.type === 'random_interval') {
        const nextTime = getRandomTime(20, 40);
        chrome.alarms.create(alarm.name, {
          delayInMinutes: nextTime
        });
      } else if (task.type === 'interval') {
        chrome.alarms.create(alarm.name, {
          periodInMinutes: task.intervalMinutes
        });
      }
    }
  }
});

// YouTube monitoring
function startYoutubeMonitoring() {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
  
  checkInterval = setInterval(async () => {
    const data = await chrome.storage.local.get(['youtubeEnabled']);
    
    if (data.youtubeEnabled === false) {
      return;
    }
    
    const tabs = await chrome.tabs.query({ active: true });
    const currentTab = tabs[0];
    
    if (currentTab && currentTab.url && currentTab.url.includes('youtube.com')) {
      if (!youtubeStartTime) {
        youtubeStartTime = Date.now();
        youtubeAlertSent = false;
      }
      
      const elapsedMinutes = (Date.now() - youtubeStartTime) / 1000 / 60;
      
      // Check if 30 minutes have passed
      if (elapsedMinutes >= 30 && !youtubeAlertSent) {
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: '🎯 Stay Focused!',
          message: randomMessage,
          priority: 2,
          requireInteraction: true
        });
        
        youtubeAlertSent = true;
        
        // Reset timer after alert
        setTimeout(() => {
          youtubeStartTime = Date.now();
          youtubeAlertSent = false;
        }, 60000); // Reset after 1 minute
      }
    } else {
      // Reset timer when not on YouTube
      youtubeStartTime = null;
      youtubeAlertSent = false;
    }
  }, 30000); // Check every 30 seconds
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    const data = await chrome.storage.local.get(['youtubeEnabled']);
    
    if (data.youtubeEnabled === false) {
      return;
    }
    
    if (tab.url && tab.url.includes('youtube.com')) {
      if (!youtubeStartTime) {
        youtubeStartTime = Date.now();
        youtubeAlertSent = false;
      }
    } else {
      youtubeStartTime = null;
      youtubeAlertSent = false;
    }
  }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const data = await chrome.storage.local.get(['youtubeEnabled']);
  
  if (data.youtubeEnabled === false) {
    return;
  }
  
  const tab = await chrome.tabs.get(activeInfo.tabId);
  
  if (tab.url && tab.url.includes('youtube.com')) {
    if (!youtubeStartTime) {
      youtubeStartTime = Date.now();
      youtubeAlertSent = false;
    }
  } else {
    youtubeStartTime = null;
    youtubeAlertSent = false;
  }
});

// Message listener for popup communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'addTask') {
    addTask(request.task).then(sendResponse);
    return true;
  } else if (request.action === 'getTasks') {
    getTasks().then(sendResponse);
    return true;
  } else if (request.action === 'deleteTask') {
    deleteTask(request.taskId).then(sendResponse);
    return true;
  } else if (request.action === 'toggleTask') {
    toggleTask(request.taskId, request.enabled).then(sendResponse);
    return true;
  } else if (request.action === 'getYoutubeStatus') {
    getYoutubeStatus().then(sendResponse);
    return true;
  } else if (request.action === 'setYoutubeEnabled') {
    setYoutubeEnabled(request.enabled).then(sendResponse);
    return true;
  }
});

async function addTask(task) {
  const data = await chrome.storage.local.get(['tasks']);
  const tasks = data.tasks || [];
  
  task.id = Date.now().toString();
  task.enabled = true;
  task.createdAt = new Date().toISOString();
  
  tasks.push(task);
  await chrome.storage.local.set({ tasks });
  
  scheduleTask(task);
  
  return { success: true, tasks };
}

async function getTasks() {
  const data = await chrome.storage.local.get(['tasks']);
  return { tasks: data.tasks || [] };
}

async function deleteTask(taskId) {
  const data = await chrome.storage.local.get(['tasks']);
  const tasks = (data.tasks || []).filter(t => t.id !== taskId);
  await chrome.storage.local.set({ tasks });
  
  // Clear the alarm
  chrome.alarms.clear(`task-${taskId}`);
  
  return { success: true, tasks };
}

async function toggleTask(taskId, enabled) {
  const data = await chrome.storage.local.get(['tasks']);
  const tasks = data.tasks || [];
  
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].enabled = enabled;
    await chrome.storage.local.set({ tasks });
    
    if (enabled) {
      scheduleTask(tasks[taskIndex]);
    } else {
      chrome.alarms.clear(`task-${taskId}`);
    }
  }
  
  return { success: true, tasks };
}

async function getYoutubeStatus() {
  const data = await chrome.storage.local.get(['youtubeEnabled']);
  return { enabled: data.youtubeEnabled !== false };
}

async function setYoutubeEnabled(enabled) {
  await chrome.storage.local.set({ youtubeEnabled: enabled });
  
  if (enabled) {
    startYoutubeMonitoring();
  } else {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
    youtubeStartTime = null;
    youtubeAlertSent = false;
  }
  
  return { success: true, enabled };
}

// Initialize on startup
initializeAlarms();
