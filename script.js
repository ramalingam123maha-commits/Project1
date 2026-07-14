// Fitness Tracker App - Main JavaScript File

// Initialize workouts array from localStorage
let workouts = JSON.parse(localStorage.getItem('workouts')) || [];

// DOM Elements
const workoutForm = document.getElementById('workoutForm');
const exerciseName = document.getElementById('exerciseName');
const duration = document.getElementById('duration');
const calories = document.getElementById('calories');
const date = document.getElementById('date');
const workoutsList = document.getElementById('workoutsList');
const clearBtn = document.getElementById('clearBtn');

// Set today's date as default
const today = new Date().toISOString().split('T')[0];
date.value = today;

// Event Listeners
workoutForm.addEventListener('submit', addWorkout);
clearBtn.addEventListener('click', clearAllWorkouts);

/**
 * Add a new workout to the list
 */
function addWorkout(e) {
    e.preventDefault();

    // Create workout object
    const workout = {
        id: Date.now(),
        exercise: exerciseName.value.trim(),
        duration: parseInt(duration.value),
        calories: parseInt(calories.value),
        date: date.value
    };

    // Add to array
    workouts.push(workout);

    // Save to localStorage
    saveToLocalStorage();

    // Clear form
    workoutForm.reset();
    date.value = today;

    // Update UI
    renderWorkouts();
    updateStats();

    // Show success feedback
    showNotification('Workout added successfully!');
}

/**
 * Render all workouts in the DOM
 */
function renderWorkouts() {
    if (workouts.length === 0) {
        workoutsList.innerHTML = '<p class="empty-state">No workouts yet. Start by adding your first workout!</p>';
        return;
    }

    // Sort workouts by date (newest first)
    const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));

    workoutsList.innerHTML = sortedWorkouts.map(workout => `
        <div class="workout-item">
            <div class="workout-details">
                <h3>${sanitize(workout.exercise)}</h3>
                <div class="workout-info">
                    <span>⏱️ ${workout.duration} mins</span>
                    <span>🔥 ${workout.calories} kcal</span>
                </div>
                <div class="workout-date">📅 ${formatDate(workout.date)}</div>
            </div>
            <button class="btn-delete" onclick="deleteWorkout(${workout.id})">Delete</button>
        </div>
    `).join('');
}

/**
 * Delete a specific workout
 */
function deleteWorkout(id) {
    workouts = workouts.filter(workout => workout.id !== id);
    saveToLocalStorage();
    renderWorkouts();
    updateStats();
    showNotification('Workout deleted');
}

/**
 * Clear all workouts with confirmation
 */
function clearAllWorkouts() {
    if (workouts.length === 0) {
        showNotification('No workouts to clear');
        return;
    }

    if (confirm('Are you sure you want to delete all workouts? This cannot be undone.')) {
        workouts = [];
        saveToLocalStorage();
        renderWorkouts();
        updateStats();
        showNotification('All workouts cleared');
    }
}

/**
 * Update statistics display
 */
function updateStats() {
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    const avgCalories = totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0;

    // Update DOM
    document.getElementById('totalWorkouts').textContent = totalWorkouts;
    document.getElementById('totalDuration').textContent = `${totalDuration} mins`;
    document.getElementById('totalCalories').textContent = `${totalCalories} kcal`;
    document.getElementById('avgCalories').textContent = `${avgCalories} kcal`;
}

/**
 * Save workouts to localStorage
 */
function saveToLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(workouts));
}

/**
 * Format date to readable format
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Sanitize input to prevent XSS
 */
function sanitize(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Show notification feedback
 */
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #51cf66;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderWorkouts();
    updateStats();
});
