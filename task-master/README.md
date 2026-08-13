# Task Master - Desktop Productivity Application

A fully functional offline-first desktop task and calendar management application designed for entrepreneurs managing multiple business activities.

## Features

### 📋 Task Management
- Create, edit, delete, and complete tasks
- Categorize tasks (Marketing, Content, Client Work, Video, Outreach, Management, Writing)
- Set priority levels (Low, Medium, High)
- Schedule tasks with specific dates
- Track task duration estimates
- Filter tasks by status (All, Today, Pending, Completed, Overdue)

### 📅 Calendar Integration
- Visual monthly calendar view
- See scheduled tasks at a glance
- Navigate between months
- Quick access to today's date
- Click on any day to see scheduled tasks

### 🔔 Notifications & Alerts
- Desktop push notifications for due tasks
- Overdue task warnings
- Hourly notification checks
- System tray integration
- "Check Alerts" button for manual notification check

### 📊 Progress Tracking
- Real-time statistics dashboard
- Total, completed, pending, and overdue task counts
- Weekly progress bar
- Completion percentage tracking

### 💾 Offline-First Design
- All data stored locally on your computer
- No internet required for core functionality
- Fast performance
- Privacy-focused (your data stays on your device)

### 🎨 Modern UI/UX
- Dark theme optimized for long work sessions
- Responsive design
- Smooth animations
- Intuitive interface
- Motivational quotes to keep you inspired

## Pre-configured Task Templates

The app comes with templates based on your workflow:

1. **Email Marketing Day** - Gather subscriber emails, create soap opera sequences
2. **Social Media Content Creation** - Posts for YouTube, Facebook, Instagram, TikTok, website
3. **Client Posts Generation** - Create 150+ posts for clients
4. **Short Video Creation** - Attractive videos about offers and deals
5. **Tutorial Videos** - Platform tutorials to pre-mind clients (Dotcom Secrets strategy)
6. **Character Development** - Emotional connection content (Expert Secrets)
7. **Dream 100 Outreach** - Facebook group admin relationship building (Traffic Secrets)
8. **Community Management** - Handle messages and registrations
9. **Book Writing Session** - Write your ebook chapters

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies

```bash
cd task-master
npm install
```

### Step 2: Run in Development Mode

```bash
npm start
```

This will launch the Electron application on your desktop.

### Step 3: Build for Windows Production

```bash
npm run build
```

This creates a Windows installer in the `dist` folder that you can:
- Double-click to install
- Share with others
- Distribute as your official desktop app

The built app will:
- Create a desktop shortcut
- Add to Start Menu
- Run independently of Node.js/npm
- Work completely offline

## Usage Guide

### Daily Workflow

**Morning:**
1. Open Task Master (double-click desktop icon after installation)
2. Check today's tasks in the dashboard
3. Review any overdue tasks from previous days
4. Get motivated with daily quote

**During the Day:**
1. Complete tasks by clicking "✓ Complete" button
2. Add new tasks as they come up
3. Use calendar to schedule future tasks
4. Receive desktop notifications for important deadlines

**End of Day:**
1. Review completed tasks
2. Check progress percentage
3. Plan tomorrow's tasks
4. Ensure no tasks are overdue

### Creating Your Schedule

Based on your requirements, here's a suggested weekly schedule:

- **Day 1**: Email Marketing + Community Management
- **Day 2**: Social Media Content Creation (all platforms)
- **Day 3**: Client Posts Generation (aim for 150+)
- **Day 4**: Tutorial Video Creation
- **Day 5**: Short Offer/Deal Videos
- **Day 6**: Character Development Content
- **Day 7**: Dream 100 Outreach + Book Writing

Use the calendar to assign these tasks to specific dates!

### Adding Tasks

1. Click "➕ Add Task" button
2. Fill in task details:
   - Title (required)
   - Description
   - Category
   - Priority
   - Scheduled Date
   - Duration estimate
3. Click "💾 Save Task"

### Managing Messages Across Platforms

Create recurring daily tasks:
- "Check all social media messages" (Management category, 1 hour)
- "Respond to community registrations" (Management category, 1 hour)
- "Review client inquiries" (Client Work category, 1 hour)

## Data Storage

Your data is stored in:
- **Windows**: `%APPDATA%/task-master/task-data.json`
- **Format**: JSON file
- **Backup**: You can copy this file to backup all your tasks

## Troubleshooting

### App won't start
- Make sure you ran `npm install` first
- Check if Node.js is installed: `node --version`

### Notifications not showing
- Check Windows notification settings
- Ensure notifications are enabled in your system

### Data not saving
- Check file permissions in the app data directory
- Make sure disk space is available

## Building for Distribution

To create a shareable Windows installer:

```bash
npm run build
```

Output files will be in the `dist/` folder:
- `Task Master Setup x.x.x.exe` - Standard installer
- Can be installed on any Windows PC
- No Node.js required on target machines

## Tips for Success

1. **Start each day** by checking the dashboard
2. **Don't ignore red alerts** - overdue tasks mean competitors are winning
3. **Use categories** to balance different types of work
4. **Set realistic durations** - don't overload single days
5. **Celebrate completions** - watch your progress bar grow!
6. **Review weekly** - plan next week every Friday
7. **Keep it updated** - add tasks immediately when they come up

## Technical Details

- **Framework**: Electron
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Local JSON file (offline-first)
- **Notifications**: Electron Notification API
- **Build Tool**: electron-builder

## Next Steps

1. Install dependencies: `npm install`
2. Test in development: `npm start`
3. Customize task templates in `main.js` if needed
4. Build for production: `npm run build`
5. Install the generated `.exe` file
6. Start organizing your work!

---

**Remember**: "Success doesn't come from what you do occasionally, it comes from what you do consistently!"

Good luck with your business! 🚀
