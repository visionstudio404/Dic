# Focus Alert System - Chrome Extension

A powerful productivity Chrome extension that helps you stay focused on your tasks while blocking YouTube distractions with motivational alerts.

## Features

### 🎯 Task Reminders
- **Random Interval Alerts**: Get reminded every 20-40 minutes (random) to create website posts
- **Specific Time Alerts**: Set reminders for anime episode releases, meetings, etc.
- **Regular Interval Alerts**: Custom intervals for recurring tasks

### ⚡ Quick Add Templates
Pre-configured buttons for common tasks:
- 🌐 Website Post (random 20-40 min)
- 💬 Check Messages (every 30 min)
- 👥 Check New Registrations (every 60 min)
- 📖 Write Book Chapter (every 90 min)
- 📱 Create Social Media Post (every 120 min)

### 🚫 YouTube Distraction Blocker
- Monitors your YouTube usage
- Sends motivational alerts after 30 minutes of continuous browsing
- Random motivational messages like:
  - "Your book won't write itself. Close YouTube and create!"
  - "Future you will thank present you for staying focused."
  - "Your brand needs you focused. Close YouTube now!"

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the `focus-alert-extension` folder
5. The extension icon will appear in your toolbar

## Usage

### Adding a Reminder
1. Click the extension icon in your toolbar
2. Fill in the task title and optional message
3. Choose reminder type:
   - **Random Interval**: 20-40 minutes (perfect for creative tasks)
   - **Regular Interval**: Custom time interval
   - **Specific Date/Time**: For scheduled events like anime episodes
4. Click "Add Reminder"

### Managing Reminders
- View all active reminders in the list
- Pause/activate reminders with the ⏸️/▶️ button
- Delete reminders with the 🗑️ button

### YouTube Protection
- Toggle the YouTube Distraction Blocker on/off
- When enabled, you'll get motivational alerts after 30 minutes on YouTube
- The timer resets when you leave YouTube

## File Structure

```
focus-alert-extension/
├── manifest.json       # Extension configuration
├── background.js       # Service worker for alarms and monitoring
├── popup.html          # Extension popup UI
├── popup.js            # Popup functionality
├── styles.css          # Popup styling
└── icons/              # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Permissions

The extension requires these permissions:
- **alarms**: Schedule reminders
- **storage**: Save your tasks and settings
- **notifications**: Show alert notifications
- **tabs**: Monitor YouTube usage
- **activeTab**: Access current tab information

## Tips

1. Use random interval reminders for creative tasks to prevent burnout
2. Set specific time alerts for anime episodes or scheduled events
3. Keep the YouTube blocker enabled during work hours
4. Use quick add buttons for frequently recurring tasks

## Support

For issues or feature requests, please check the extension settings or reload the extension from `chrome://extensions/`.

---

Made with ❤️ to help you stay focused and productive!
