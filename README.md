# 🎯 Focus Alert System

A comprehensive productivity and focus management tool that helps you stay on track with your tasks while preventing distractions.

## Features

### ✅ Task Reminders
- **Random Interval Reminders**: Get notified at random intervals (e.g., 20-40 minutes) for tasks like creating website posts
- **Recurring Tasks**: Set fixed interval reminders for regular activities
- **Scheduled Alerts**: Add one-time or daily scheduled reminders (perfect for anime episodes!)

### 📋 Pre-configured Tasks
The system comes with default tasks for:
- Creating website posts (every 20-40 minutes, random)
- Writing your book (every 60 minutes)
- Creating social media posts (every 30-60 minutes, random)
- Checking messages (every 30 minutes)
- Checking new registrations (every 45 minutes)

### 🎬 YouTube Distraction Blocker
- Monitors your browser for YouTube activity
- After 30 minutes of continuous YouTube watching (configurable), sends a motivational alert
- Random motivational messages to help you get back to work
- Examples: "Remember your goals! Every minute counts. Close YouTube and get back to work!"

### 🔔 Notifications
- Console-based alerts (works everywhere)
- Optional desktop notifications (requires `plyer`)
- Customizable messages for each task

## Installation

### Required
- Python 3.6+

### Optional (for enhanced features)
```bash
pip install psutil plyer
```

- `psutil`: Enables YouTube browser monitoring
- `plyer`: Enables desktop notifications

## Usage

### Quick Start
```bash
python focus_alert.py
```
This opens the interactive menu where you can manage tasks and start the system.

### Command Line Options
```bash
# Open interactive menu
python focus_alert.py --menu

# List all current tasks
python focus_alert.py --list

# Start the alert system directly
python focus_alert.py --start
```

### Interactive Menu Options

1. **List all tasks** - View all configured tasks with their next trigger times
2. **Add random interval task** - Create a task that triggers at random intervals
3. **Add recurring task** - Create a task that triggers at fixed intervals
4. **Add scheduled task** - Add a time-specific reminder (e.g., anime episode)
5. **Remove task** - Delete a task
6. **Toggle task enable/disable** - Temporarily disable/enable a task
7. **Change YouTube threshold** - Adjust how long before YouTube distraction alert fires
8. **Start alerts** - Begin the alert system
9. **Exit** - Close the menu

## Adding an Anime Reminder

1. Select option 4 from the menu
2. Enter the anime/show name
3. Enter the episode time in 24-hour format (HH:MM)
4. The system will alert you when it's time!

Example:
```
Anime/Show name: Attack on Titan
Episode time: 14:30
```

## Configuration

All settings are saved in `focus_alerts_config.json`. The system automatically:
- Saves your tasks
- Remembers task history
- Stores YouTube threshold preference
- Preserves custom messages

## How It Works

### Random Interval Tasks
When you add a task with random intervals (e.g., 20-40 minutes):
1. The system picks a random time within your range
2. Triggers the alert at that time
3. Picks a new random time for the next trigger
4. This keeps you engaged without predictable patterns

### YouTube Monitoring
The system:
1. Checks running processes every 10 seconds
2. Detects if any browser has youtube.com open
3. Tracks continuous viewing time
4. Sends ONE motivational alert after threshold (30 min default)
5. Resets when you close YouTube

### Motivational Messages
The system includes 15+ unique motivational messages that randomly appear when you're distracted by YouTube, such as:
- "Your book won't write itself. Your audience is waiting. Let's go!"
- "Success is built one focused moment at a time. You got this!"
- "Future you will thank present you for staying focused!"

## Customization

### Add Custom Tasks
Use the interactive menu to add tasks specific to your workflow.

### Modify Motivational Messages
Edit the `MotivationalMessageGenerator.MESSAGES` list in the code to add your own motivational quotes.

### Change Check Intervals
Modify the `time.sleep()` values in the code to check more or less frequently.

## Tips for Maximum Productivity

1. **Start with defaults**: The pre-configured tasks cover common creator workflows
2. **Adjust YouTube threshold**: If 30 minutes is too long/short, change it to match your habits
3. **Add anime reminders**: Never miss an episode again!
4. **Use random intervals**: They prevent you from anticipating and ignoring alerts
5. **Keep it running**: Run the system in a terminal window while you work

## Troubleshooting

### No desktop notifications?
Install plyer: `pip install plyer`

### YouTube monitoring not working?
Install psutil: `pip install psutil`
Note: YouTube monitoring works best on the same machine where you run the script.

### Want it to run in background?
On Linux/Mac: `nohup python focus_alert.py --start &`
On Windows: Use Task Scheduler or run in a dedicated terminal

## License

Free to use and modify for personal productivity!

---

**Stay focused. Create amazing things. 🚀**
