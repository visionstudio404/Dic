# Task Master - Installation & Build Guide

## Quick Start (Development Mode)

If you want to test the app immediately:

```bash
cd task-master
npm install
npm start
```

This will launch the app in development mode using Electron.

## Building for Windows Production

To create a double-click installable `.exe` file for Windows:

### Option 1: Build on Your Windows Machine (Recommended)

Since you're on Windows, the easiest approach is:

1. **Copy the `task-master` folder to your Windows computer**

2. **Open Command Prompt or PowerShell** in that folder

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Install Electron and electron-builder:**
   ```bash
   npm install --save-dev electron electron-builder
   ```

5. **Update package.json** - Add this build configuration to your package.json:

   ```json
   {
     "name": "task-master",
     "version": "1.0.0",
     "description": "Desktop Task & Calendar Manager with Notifications",
     "main": "main.js",
     "scripts": {
       "start": "electron .",
       "build": "electron-builder --win"
     },
     "devDependencies": {
       "electron": "^30.0.0",
       "electron-builder": "^24.13.3"
     },
     "build": {
       "appId": "com.taskmaster.app",
       "productName": "Task Master",
       "win": {
         "target": "nsis"
       },
       "nsis": {
         "oneClick": false,
         "allowToChangeInstallationDirectory": true,
         "createDesktopShortcut": true,
         "createStartMenuShortcut": true
       }
     }
   }
   ```

6. **Build the installer:**
   ```bash
   npm run build
   ```

7. **Find your installer** in the `dist` folder:
   - `Task Master Setup x.x.x.exe` - This is your double-click installer!

### Option 2: Use Pre-built Solution

If you don't want to build yourself:

1. The app code is complete and ready
2. Take it to any Windows machine with Node.js installed
3. Follow Option 1 steps above
4. Takes about 5-10 minutes to build

## What You'll Get

After building, you'll have:

✅ **Task Master Setup.exe** - Professional Windows installer
✅ **Desktop shortcut** - Double-click to open anytime
✅ **Start Menu entry** - Easy access from Windows menu
✅ **System tray icon** - Quick access and notifications
✅ **Offline functionality** - Works without internet
✅ **Auto-updates ready** - Can add update functionality later

## System Requirements

### For Building:
- Windows 10/11 (or macOS/Linux with Wine)
- Node.js v16 or higher (download from nodejs.org)
- About 500MB free disk space
- Internet connection (for downloading dependencies)

### For Running the App:
- Windows 10/11
- No Node.js required (after building)
- About 150MB disk space
- Works completely offline

## Troubleshooting

### "npm is not recognized"
Install Node.js from https://nodejs.org

### Build fails with permission errors
Run Command Prompt as Administrator

### App won't start after installation
Check Windows Defender - might need to allow the app

### Icons not showing
The app works without custom icons, but for production:
- Create a 256x256 PNG file named `icon.png`
- Place it in the `assets` folder
- Update package.json to reference it

## File Structure

```
task-master/
├── main.js           # Electron main process
├── index.html        # UI interface
├── package.json      # Dependencies & build config
├── assets/           # Icons and images
├── README.md         # User documentation
└── INSTALL.md        # This file
```

## After Installation

Once you have the `.exe` installer:

1. **Double-click** `Task Master Setup.exe`
2. Follow installation wizard
3. Choose installation location (or use default)
4. Click "Finish"
5. **Task Master** icon appears on your desktop
6. **Double-click** desktop icon to launch!

## Daily Usage

### Morning Routine:
1. Open Task Master from desktop
2. See today's tasks automatically
3. Check for overdue alerts
4. Read motivational quote

### During Work:
1. Mark tasks complete as you finish them
2. Add new tasks when they come up
3. Use calendar to schedule future work
4. Get notified of important deadlines

### End of Day:
1. Review what you accomplished
2. Check progress percentage
3. Plan tomorrow's tasks
4. Close the app (your data auto-saves)

## Data Backup

Your tasks are stored in:
```
%APPDATA%\task-master\task-data.json
```

To backup:
1. Copy this file to USB drive or cloud storage
2. To restore, paste it back to the same location

## Support

If you encounter issues:

1. Check if Node.js is installed: `node --version`
2. Delete `node_modules` folder and run `npm install` again
3. Make sure you have enough disk space
4. Try running as Administrator

## Next Steps

1. ✅ Copy `task-master` folder to your Windows PC
2. ✅ Open Command Prompt in that folder
3. ✅ Run: `npm install`
4. ✅ Run: `npm install --save-dev electron electron-builder`
5. ✅ Run: `npm run build`
6. ✅ Install the generated `.exe` from `dist` folder
7. ✅ Start organizing your tasks!

---

**Remember**: This app is designed specifically for YOUR workflow - email marketing, social media, client work, videos, Dream 100, community management, and book writing.

You've got this! 💪
