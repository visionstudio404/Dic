#!/usr/bin/env python3
"""
Focus Alert System - A comprehensive reminder and focus management tool
Features:
- Random interval reminders for recurring tasks
- Scheduled alerts for specific events (anime episodes, etc.)
- YouTube distraction detection with motivational messages
- Multi-task management (book writing, social media, messages, registrations)
"""

import json
import time
import random
import threading
from datetime import datetime, timedelta
from pathlib import Path
import sys
import os

# Try to import optional dependencies
try:
    import psutil
    HAS_PSUTIL = True
except ImportError:
    HAS_PSUTIL = False

try:
    from plyer import notification
    HAS_PLYER = True
except ImportError:
    HAS_PLYER = False


class Task:
    """Represents a reminder task"""
    
    def __init__(self, name, task_type, interval_minutes=None, scheduled_time=None, 
                 custom_message=None, enabled=True):
        self.name = name
        self.task_type = task_type  # 'random_interval', 'scheduled', 'recurring'
        self.interval_minutes = interval_minutes
        self.scheduled_time = scheduled_time
        self.custom_message = custom_message or f"Time to {name}!"
        self.enabled = enabled
        self.last_triggered = None
        self.next_trigger = self._calculate_next_trigger()
    
    def _calculate_next_trigger(self):
        """Calculate next trigger time based on task type"""
        if self.task_type == 'random_interval':
            if self.last_triggered:
                interval = random.randint(
                    self.interval_minutes[0], 
                    self.interval_minutes[1]
                )
                return self.last_triggered + timedelta(minutes=interval)
            else:
                interval = random.randint(
                    self.interval_minutes[0], 
                    self.interval_minutes[1]
                )
                return datetime.now() + timedelta(minutes=interval)
        
        elif self.task_type == 'scheduled':
            if self.scheduled_time:
                scheduled_dt = datetime.combine(datetime.now().date(), self.scheduled_time)
                if scheduled_dt <= datetime.now():
                    scheduled_dt += timedelta(days=1)
                return scheduled_dt
        
        elif self.task_type == 'recurring':
            if self.last_triggered:
                return self.last_triggered + timedelta(minutes=self.interval_minutes)
            else:
                return datetime.now() + timedelta(minutes=self.interval_minutes)
        
        return None
    
    def should_trigger(self):
        """Check if task should trigger now"""
        if not self.enabled or not self.next_trigger:
            return False
        return datetime.now() >= self.next_trigger
    
    def trigger(self):
        """Execute task trigger"""
        self.last_triggered = datetime.now()
        self.next_trigger = self._calculate_next_trigger()
        return self.custom_message
    
    def to_dict(self):
        """Convert task to dictionary for serialization"""
        return {
            'name': self.name,
            'task_type': self.task_type,
            'interval_minutes': self.interval_minutes,
            'scheduled_time': self.scheduled_time.strftime('%H:%M') if self.scheduled_time else None,
            'custom_message': self.custom_message,
            'enabled': self.enabled,
            'last_triggered': self.last_triggered.isoformat() if self.last_triggered else None,
            'next_trigger': self.next_trigger.isoformat() if self.next_trigger else None
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create task from dictionary"""
        scheduled_time = None
        if data.get('scheduled_time'):
            scheduled_time = datetime.strptime(data['scheduled_time'], '%H:%M').time()
        
        last_triggered = None
        if data.get('last_triggered'):
            last_triggered = datetime.fromisoformat(data['last_triggered'])
        
        next_trigger = None
        if data.get('next_trigger'):
            next_trigger = datetime.fromisoformat(data['next_trigger'])
        
        task = cls(
            name=data['name'],
            task_type=data['task_type'],
            interval_minutes=data.get('interval_minutes'),
            scheduled_time=scheduled_time,
            custom_message=data.get('custom_message'),
            enabled=data.get('enabled', True)
        )
        task.last_triggered = last_triggered
        task.next_trigger = next_trigger
        return task


class MotivationalMessageGenerator:
    """Generates motivational messages for YouTube distraction alerts"""
    
    MESSAGES = [
        "🎯 Remember your goals! Every minute counts. Close YouTube and get back to work!",
        "💪 You're building something amazing. Don't let distractions steal your dreams!",
        "⏰ Time is your most valuable asset. Invest it wisely. Back to work!",
        "🚀 Success is built one focused moment at a time. You got this!",
        "📚 Your book won't write itself. Your audience is waiting. Let's go!",
        "🎨 Creative genius happens when you show up. Show up now!",
        "🔥 The world needs what you're creating. Don't stop now!",
        "💎 Diamonds are formed under pressure. Great work requires focus!",
        "🌟 Future you will thank present you for staying focused!",
        "⚡ Channel this energy into your craft. Create something incredible!",
        "🎬 Your story matters. Tell it. Write it. Share it. Now!",
        "🏆 Champions aren't made in comfort zones. Get back to work!",
        "📈 Every minute of focus brings you closer to your goals!",
        "🎭 Your brand is growing because YOU show up. Show up now!",
        "✨ Distraction is the enemy of execution. Execute your vision!"
    ]
    
    @classmethod
    def get_message(cls):
        """Get a random motivational message"""
        return random.choice(cls.MESSAGES)


class YouTubeMonitor:
    """Monitors YouTube usage and sends alerts after threshold"""
    
    def __init__(self, threshold_minutes=30):
        self.threshold_seconds = threshold_minutes * 60
        self.youtube_start_time = None
        self.is_watching = False
        self.alert_sent = False
        self.monitoring = False
    
    def check_youtube_activity(self):
        """Check if YouTube is currently active"""
        if not HAS_PSUTIL:
            return False
        
        youtube_processes = []
        for proc in psutil.process_iter(['name', 'cmdline']):
            try:
                name = proc.info['name'] or ''
                cmdline = ' '.join(proc.info['cmdline'] or [])
                if 'youtube' in name.lower() or 'youtube' in cmdline.lower() or \
                   'chrome' in name.lower() or 'firefox' in name.lower() or \
                   'browser' in name.lower():
                    # Check if any browser has YouTube open
                    if 'youtube.com' in cmdline:
                        youtube_processes.append(proc)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        
        return len(youtube_processes) > 0
    
    def monitor(self, callback):
        """Monitor YouTube activity and trigger callback when threshold reached"""
        self.monitoring = True
        
        while self.monitoring:
            is_youtube_active = self.check_youtube_activity()
            
            if is_youtube_active:
                if not self.is_watching:
                    self.youtube_start_time = time.time()
                    self.is_watching = True
                    self.alert_sent = False
                
                elapsed = time.time() - self.youtube_start_time
                
                if elapsed >= self.threshold_seconds and not self.alert_sent:
                    message = MotivationalMessageGenerator.get_message()
                    callback(message)
                    self.alert_sent = True
            else:
                self.is_watching = False
                self.youtube_start_time = None
                self.alert_sent = False
            
            time.sleep(10)  # Check every 10 seconds
    
    def stop(self):
        """Stop monitoring"""
        self.monitoring = False


class FocusAlertSystem:
    """Main alert system managing all tasks and notifications"""
    
    def __init__(self, config_file='focus_alerts_config.json'):
        self.config_file = Path(config_file)
        self.tasks = []
        self.youtube_monitor = None
        self.running = False
        self.load_config()
    
    def load_config(self):
        """Load configuration from file"""
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r') as f:
                    data = json.load(f)
                    self.tasks = [Task.from_dict(t) for t in data.get('tasks', [])]
                    youtube_threshold = data.get('youtube_threshold_minutes', 30)
                    self.youtube_monitor = YouTubeMonitor(youtube_threshold)
            except Exception as e:
                print(f"Error loading config: {e}")
                self.tasks = []
                self.youtube_monitor = YouTubeMonitor()
        else:
            self.youtube_monitor = YouTubeMonitor()
            # Add default tasks
            self.add_default_tasks()
    
    def save_config(self):
        """Save configuration to file"""
        data = {
            'tasks': [t.to_dict() for t in self.tasks],
            'youtube_threshold_minutes': self.youtube_monitor.threshold_seconds // 60
        }
        with open(self.config_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def add_default_tasks(self):
        """Add default tasks for common use cases"""
        defaults = [
            Task(
                name="Create website post",
                task_type="random_interval",
                interval_minutes=(20, 40),
                custom_message="⏰ Time to create a post on your website!"
            ),
            Task(
                name="Write book",
                task_type="recurring",
                interval_minutes=60,
                custom_message="📚 Time to write your book! Your story awaits!"
            ),
            Task(
                name="Create social media posts",
                task_type="random_interval",
                interval_minutes=(30, 60),
                custom_message="📱 Time to create social media posts for your brand!"
            ),
            Task(
                name="Check messages",
                task_type="recurring",
                interval_minutes=30,
                custom_message="💬 Time to check your messages!"
            ),
            Task(
                name="Check new registrations",
                task_type="recurring",
                interval_minutes=45,
                custom_message="📋 Time to check new registrations!"
            )
        ]
        self.tasks.extend(defaults)
        self.save_config()
    
    def add_task(self, task):
        """Add a new task"""
        self.tasks.append(task)
        self.save_config()
    
    def remove_task(self, task_name):
        """Remove a task by name"""
        self.tasks = [t for t in self.tasks if t.name != task_name]
        self.save_config()
    
    def add_anime_reminder(self, anime_name, episode_time, episode_day=None):
        """Add an anime episode reminder"""
        try:
            scheduled_time = datetime.strptime(episode_time, '%H:%M').time()
            task = Task(
                name=f"Watch {anime_name}",
                task_type="scheduled",
                scheduled_time=scheduled_time,
                custom_message=f"🎬 {anime_name} episode is airing now! Time to watch!"
            )
            self.add_task(task)
            return True
        except ValueError as e:
            print(f"Invalid time format. Use HH:MM (24-hour format). Error: {e}")
            return False
    
    def send_notification(self, title, message):
        """Send a system notification"""
        print(f"\n{'='*60}")
        print(f"🔔 ALERT: {title}")
        print(f"   {message}")
        print(f"{'='*60}\n")
        
        if HAS_PLYER:
            try:
                notification.notify(
                    title=title,
                    message=message,
                    app_name="Focus Alert System",
                    timeout=10
                )
            except Exception as e:
                print(f"Notification error: {e}")
    
    def run_task_checker(self):
        """Continuously check and trigger tasks"""
        while self.running:
            for task in self.tasks:
                if task.should_trigger():
                    message = task.trigger()
                    self.send_notification(f"Reminder: {task.name}", message)
            
            time.sleep(5)  # Check every 5 seconds
    
    def run_youtube_monitor(self):
        """Run YouTube monitoring in background"""
        def on_youtube_alert(message):
            self.send_notification("⚠️ YouTube Distraction Alert!", message)
        
        self.youtube_monitor.monitor(on_youtube_alert)
    
    def start(self):
        """Start the alert system"""
        self.running = True
        print("🚀 Focus Alert System Starting...")
        print(f"📋 Loaded {len(self.tasks)} tasks")
        print(f"🎯 YouTube monitoring threshold: {self.youtube_monitor.threshold_seconds // 60} minutes")
        print("\nPress Ctrl+C to stop\n")
        
        # Start task checker in main thread
        task_thread = threading.Thread(target=self.run_task_checker, daemon=True)
        task_thread.start()
        
        # Start YouTube monitor in separate thread
        youtube_thread = threading.Thread(target=self.run_youtube_monitor, daemon=True)
        youtube_thread.start()
        
        try:
            while self.running:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n\n👋 Stopping Focus Alert System...")
            self.stop()
    
    def stop(self):
        """Stop the alert system"""
        self.running = False
        if self.youtube_monitor:
            self.youtube_monitor.stop()
        self.save_config()
    
    def list_tasks(self):
        """List all current tasks"""
        print("\n📋 Current Tasks:")
        print("-" * 60)
        for i, task in enumerate(self.tasks, 1):
            status = "✅" if task.enabled else "❌"
            next_time = task.next_trigger.strftime('%Y-%m-%d %H:%M:%S') if task.next_trigger else "N/A"
            print(f"{i}. {status} {task.name}")
            print(f"   Type: {task.task_type}")
            if task.interval_minutes:
                print(f"   Interval: {task.interval_minutes} minutes")
            print(f"   Next: {next_time}")
            print(f"   Message: {task.custom_message}")
            print()
    
    def interactive_menu(self):
        """Show interactive menu for managing tasks"""
        while True:
            print("\n" + "="*60)
            print("🎯 FOCUS ALERT SYSTEM MENU")
            print("="*60)
            print("1. List all tasks")
            print("2. Add random interval task")
            print("3. Add recurring task")
            print("4. Add scheduled task (e.g., anime)")
            print("5. Remove task")
            print("6. Toggle task enable/disable")
            print("7. Change YouTube threshold")
            print("8. Start alerts")
            print("9. Exit")
            print("="*60)
            
            choice = input("\nEnter choice (1-9): ").strip()
            
            if choice == '1':
                self.list_tasks()
            
            elif choice == '2':
                name = input("Task name: ").strip()
                min_interval = int(input("Minimum minutes: "))
                max_interval = int(input("Maximum minutes: "))
                message = input("Custom message (or press Enter for default): ").strip()
                task = Task(
                    name=name,
                    task_type="random_interval",
                    interval_minutes=(min_interval, max_interval),
                    custom_message=message or f"Time to {name}!"
                )
                self.add_task(task)
                print(f"✅ Added task: {name}")
            
            elif choice == '3':
                name = input("Task name: ").strip()
                interval = int(input("Interval in minutes: "))
                message = input("Custom message (or press Enter for default): ").strip()
                task = Task(
                    name=name,
                    task_type="recurring",
                    interval_minutes=interval,
                    custom_message=message or f"Time to {name}!"
                )
                self.add_task(task)
                print(f"✅ Added task: {name}")
            
            elif choice == '4':
                anime_name = input("Anime/Show name: ").strip()
                episode_time = input("Episode time (HH:MM, 24-hour format): ").strip()
                if self.add_anime_reminder(anime_name, episode_time):
                    print(f"✅ Added anime reminder: {anime_name} at {episode_time}")
            
            elif choice == '5':
                self.list_tasks()
                task_num = int(input("Enter task number to remove: "))
                if 1 <= task_num <= len(self.tasks):
                    removed = self.tasks[task_num - 1].name
                    self.remove_task(removed)
                    print(f"✅ Removed task: {removed}")
            
            elif choice == '6':
                self.list_tasks()
                task_num = int(input("Enter task number to toggle: "))
                if 1 <= task_num <= len(self.tasks):
                    self.tasks[task_num - 1].enabled = not self.tasks[task_num - 1].enabled
                    status = "enabled" if self.tasks[task_num - 1].enabled else "disabled"
                    print(f"✅ Task {self.tasks[task_num - 1].name} {status}")
                    self.save_config()
            
            elif choice == '7':
                threshold = int(input("YouTube threshold in minutes (default 30): ") or "30")
                self.youtube_monitor = YouTubeMonitor(threshold)
                self.save_config()
                print(f"✅ YouTube threshold set to {threshold} minutes")
            
            elif choice == '8':
                self.start()
            
            elif choice == '9':
                print("👋 Goodbye! Stay focused!")
                break
            
            else:
                print("❌ Invalid choice. Please try again.")


def main():
    """Main entry point"""
    print("""
    ╔═══════════════════════════════════════════════════════════╗
    ║           🎯 FOCUS ALERT SYSTEM v1.0                      ║
    ║                                                           ║
    ║  Your personal productivity companion for:               ║
    ║  • Random interval reminders                             ║
    ║  • Anime episode alerts                                  ║
    ║  • Book writing sessions                                 ║
    ║  • Social media management                               ║
    ║  • Message & registration checks                         ║
    ║  • YouTube distraction blocking                          ║
    ╚═══════════════════════════════════════════════════════════╝
    """)
    
    system = FocusAlertSystem()
    
    if len(sys.argv) > 1:
        if sys.argv[1] == '--start':
            system.start()
        elif sys.argv[1] == '--list':
            system.list_tasks()
        elif sys.argv[1] == '--menu':
            system.interactive_menu()
        else:
            print("Usage: python focus_alert.py [--start|--list|--menu]")
    else:
        system.interactive_menu()


if __name__ == "__main__":
    main()
