// Focus Alert System - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements
  const taskForm = document.getElementById('taskForm');
  const taskType = document.getElementById('taskType');
  const intervalGroup = document.getElementById('intervalGroup');
  const dateTimeGroup = document.getElementById('dateTimeGroup');
  const taskList = document.getElementById('taskList');
  const youtubeToggle = document.getElementById('youtubeToggle');
  const quickButtons = document.querySelectorAll('.btn-quick');

  // Initialize
  await loadTasks();
  await loadYoutubeStatus();

  // Task type change handler
  taskType.addEventListener('change', (e) => {
    const type = e.target.value;
    intervalGroup.style.display = type === 'interval' ? 'block' : 'none';
    dateTimeGroup.style.display = type === 'specific_time' ? 'block' : 'none';
  });

  // Form submit handler
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const message = document.getElementById('taskMessage').value;
    const type = taskType.value;
    
    const task = {
      title,
      message: message || `Time to ${title}!`,
      type
    };

    if (type === 'interval') {
      task.intervalMinutes = parseInt(document.getElementById('intervalMinutes').value);
    } else if (type === 'specific_time') {
      task.scheduledTime = document.getElementById('scheduledTime').value;
    }

    await chrome.runtime.sendMessage({ action: 'addTask', task });
    
    taskForm.reset();
    intervalGroup.style.display = 'none';
    dateTimeGroup.style.display = 'none';
    taskType.value = 'random_interval';
    
    await loadTasks();
  });

  // YouTube toggle handler
  youtubeToggle.addEventListener('change', async (e) => {
    await chrome.runtime.sendMessage({ 
      action: 'setYoutubeEnabled', 
      enabled: e.target.checked 
    });
  });

  // Quick add buttons
  quickButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const type = button.dataset.type;
      const title = button.dataset.title;
      const interval = button.dataset.interval;

      const task = {
        title,
        message: `Time to ${title}!`,
        type
      };

      if (type === 'interval' && interval) {
        task.intervalMinutes = parseInt(interval);
      }

      await chrome.runtime.sendMessage({ action: 'addTask', task });
      await loadTasks();
    });
  });

  // Load tasks from storage
  async function loadTasks() {
    const response = await chrome.runtime.sendMessage({ action: 'getTasks' });
    const tasks = response.tasks || [];

    if (tasks.length === 0) {
      taskList.innerHTML = '<p class="empty-state">No reminders yet. Add one above!</p>';
      return;
    }

    taskList.innerHTML = '';
    
    tasks.forEach(task => {
      const taskItem = createTaskElement(task);
      taskList.appendChild(taskItem);
    });
  }

  // Create task element
  function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'task-item';
    
    let badgeClass = 'badge-random';
    let badgeText = 'Random';
    
    if (task.type === 'interval') {
      badgeClass = 'badge-interval';
      badgeText = `${task.intervalMinutes} min`;
    } else if (task.type === 'specific_time') {
      badgeClass = 'badge-specific';
      const date = new Date(task.scheduledTime);
      badgeText = date.toLocaleString();
    }

    div.innerHTML = `
      <div class="task-info">
        <div class="task-title">${escapeHtml(task.title)} <span class="badge ${badgeClass}">${badgeText}</span></div>
        <div class="task-details">${task.enabled ? '✅ Active' : '⏸️ Paused'}</div>
      </div>
      <div class="task-actions">
        <button class="btn-icon btn-toggle" data-id="${task.id}" data-enabled="${!task.enabled}" title="${task.enabled ? 'Pause' : 'Activate'}">
          ${task.enabled ? '⏸️' : '▶️'}
        </button>
        <button class="btn-icon btn-delete" data-id="${task.id}" title="Delete">
          🗑️
        </button>
      </div>
    `;

    // Add event listeners
    const toggleBtn = div.querySelector('.btn-toggle');
    const deleteBtn = div.querySelector('.btn-delete');

    toggleBtn.addEventListener('click', async () => {
      const enabled = toggleBtn.dataset.enabled === 'true';
      await chrome.runtime.sendMessage({ 
        action: 'toggleTask', 
        taskId: task.id, 
        enabled 
      });
      await loadTasks();
    });

    deleteBtn.addEventListener('click', async () => {
      await chrome.runtime.sendMessage({ 
        action: 'deleteTask', 
        taskId: task.id 
      });
      await loadTasks();
    });

    return div;
  }

  // Load YouTube status
  async function loadYoutubeStatus() {
    const response = await chrome.runtime.sendMessage({ action: 'getYoutubeStatus' });
    youtubeToggle.checked = response.enabled;
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
