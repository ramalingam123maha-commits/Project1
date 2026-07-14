# 💪 Fitness Tracker App

A modern, responsive web-based fitness tracking application built with HTML5, CSS3, and vanilla JavaScript. Track your workouts, monitor your progress, and achieve your fitness goals!

## Features

✨ **Core Features:**
- ➕ Add new workouts with exercise name, duration, and calories burned
- 📊 View comprehensive statistics (total workouts, duration, calories)
- 📅 Track workouts by date
- 🗑️ Delete individual workouts or clear all history
- 💾 Persistent storage using browser localStorage
- 📱 Fully responsive design (mobile, tablet, desktop)

## Project Structure

```
fitness-tracker/
├── index.html       # Main HTML file with page structure
├── styles.css       # CSS styling with responsive design
├── script.js        # JavaScript functionality
└── README.md        # This file
```

## Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with gradients, flexbox, and grid
- **JavaScript (ES6+)** - Interactive functionality and data management
- **localStorage API** - Client-side data persistence

## Installation & Usage

### Option 1: Direct Browser Access
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start adding workouts!

### Option 2: Local Web Server
For better performance and to avoid potential security issues:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js http-server
npx http-server
```

Then open `http://localhost:8000` in your browser.

## How to Use

### Adding a Workout
1. Fill in the "Add a New Workout" form:
   - **Exercise Name**: Type the name of your exercise (e.g., "Running", "Push-ups")
   - **Duration**: Enter the time spent in minutes
   - **Calories Burned**: Enter estimated calories burned
   - **Date**: Select the date of the workout
2. Click "Add Workout" button
3. Your workout will appear in the history list and stats will update

### Viewing Statistics
The "Your Stats" section displays:
- **Total Workouts**: Number of workouts logged
- **Total Duration**: Sum of all workout durations
- **Total Calories**: Total calories burned across all workouts
- **Avg Calories/Session**: Average calories burned per workout

### Managing Workouts
- **Delete Single Workout**: Click the "Delete" button on any workout
- **Clear All Workouts**: Click "Clear All" button and confirm (cannot be undone)
- Workouts are automatically sorted by date (newest first)

## Features Explained

### Data Persistence
All workouts are saved to your browser's localStorage. This means:
- ✅ Data persists even after closing the browser
- ✅ Each browser/device has separate data
- ✅ Clearing browser data will remove all workouts

### Responsive Design
The app works seamlessly on:
- 💻 Desktop computers
- 📱 Mobile phones
- 📱 Tablets

### XSS Protection
User inputs are sanitized to prevent security issues.

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancement Ideas

- 📈 Visual charts and graphs for progress tracking
- 🎯 Set and track fitness goals
- 📤 Export data to CSV
- 🌙 Dark mode toggle
- 🔔 Browser notifications for workout reminders
- ☁️ Cloud sync across devices
- 👥 Social sharing features

## License

This project is open source and available for personal and educational use.

## Contributing

Feel free to fork this project, make improvements, and submit pull requests!

## Tips for Success

1. **Be Consistent**: Log your workouts regularly for better tracking
2. **Estimate Accurately**: Use reliable sources for calorie estimates
3. **Set Goals**: Aim for specific daily/weekly targets
4. **Review Progress**: Check your stats regularly to stay motivated

---

**Keep moving, keep improving!** 💪

*Last updated: 2024*
