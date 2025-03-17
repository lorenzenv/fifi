// Convert JSX React component to browser-compatible JavaScript
const { useState, useEffect } = React;

// Main component
const WorkoutTracker = () => {
  // Initial workout plans with exercise data including image paths
  const initialWorkouts = {
    'Push Workout': [
      { name: 'Treadmill', image: './images/treadmill.png', category: 'Cardio' },
      { name: 'Arm Circles', image: './images/arm-circles.png', category: 'Warmup' },
      { name: 'World Greatest Stretch', image: './images/world-greatest-stretch.png', category: 'Mobility' },
      { name: '90/90', image: './images/90-90.png', category: 'Mobility' },
      { name: 'Cable Flys', image: './images/cable-flys.gif', category: 'Chest' },
      { name: 'Cable Triceps Pulldowns', image: './images/cable-triceps-pulldowns.png', category: 'Triceps' },
      { name: 'Dumbbell Lateral Raises Sitting', image: './images/dumbbell-lateral-raises.png', category: 'Shoulders' },
      { name: 'Machine Hack Squats', image: './images/machine-hack-squats.png', category: 'Legs' },
      { name: 'Machine Leg Extension', image: './images/machine-leg-extension.png', category: 'Legs' },
      { name: 'Barbell Bench Press', image: './images/barbell-bench-press.png', category: 'Chest' }
    ],
    'Pull A': [
      { name: 'Treadmill', image: './images/treadmill.png', category: 'Cardio' },
      { name: 'Arm Circles', image: './images/arm-circles.png', category: 'Warmup' },
      { name: 'Quadruped T Spine Mobilization', image: './images/quadruped-t-spine.png', category: 'Mobility' },
      { name: 'Ankle Mobilization', image: './images/ankle-mobilization.png', category: 'Mobility' },
      { name: 'Resistance Band Pull-ups', image: './images/resistance-band-pullups.png', category: 'Back' },
      { name: 'Cable Row Wide Sitting', image: './images/cable-row-wide.png', category: 'Back' },
      { name: 'Machine Leg Curls', image: './images/machine-leg-curls.png', category: 'Legs' },
      { name: 'Dumbbell Bicep Curls Incline', image: './images/dumbbell-bicep-curls.png', category: 'Biceps' },
      { name: 'Machine Hip Adduction', image: './images/machine-hip-adduction.png', category: 'Legs' },
      { name: 'Crunches', image: './images/crunches.png', category: 'Core' }
    ],
    'Pull B': [
      { name: 'Treadmill', image: './images/treadmill.png', category: 'Cardio' },
      { name: 'Arm Circles', image: './images/arm-circles.png', category: 'Warmup' },
      { name: 'Quadruped T Spine Mobilization', image: './images/quadruped-t-spine.png', category: 'Mobility' },
      { name: 'Ankle Mobilization', image: './images/ankle-mobilization.png', category: 'Mobility' },
      { name: 'Resistance Band Pull-ups', image: './images/resistance-band-pullups.png', category: 'Back' },
      { name: 'HumanSport Lat Pulley', image: './images/lat-pulley.png', category: 'Back' },
      { name: 'Cable Face Pulls', image: './images/cable-face-pulls.png', category: 'Shoulders' },
      { name: 'Dumbbell Bicep Curls Incline', image: './images/dumbbell-bicep-curls.png', category: 'Biceps' },
      { name: 'Machine Leg Curls', image: './images/machine-leg-curls.png', category: 'Legs' },
      { name: 'Machine Hip Adduction', image: './images/machine-hip-adduction.png', category: 'Legs' },
      { name: 'T-Bar Row', image: './images/t-bar-row.png', category: 'Back' }
    ]
  };

  // State for current workout, workout history, and form inputs
  const [currentWorkout, setCurrentWorkout] = useState('Push Workout');
  const [workoutHistory, setWorkoutHistory] = useState({});
  const [exerciseWeights, setExerciseWeights] = useState({});
  const [viewMode, setViewMode] = useState('current'); // 'current', 'history', 'progress'
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('workoutHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setWorkoutHistory(parsedHistory);
        setStatusMessage('Loaded workout history from storage');
        setTimeout(() => setStatusMessage(''), 2000);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setStatusMessage('Error loading history');
      setTimeout(() => setStatusMessage(''), 2000);
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (Object.keys(workoutHistory).length > 0) {
      try {
        localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [workoutHistory]);

  // Handle weight input change
  const handleWeightChange = (exerciseName, value) => {
    setExerciseWeights({
      ...exerciseWeights,
      [exerciseName]: value
    });
  };

  // Save current workout
  const saveWorkout = () => {
    // Check if any weights have been entered
    const hasEnteredWeights = Object.values(exerciseWeights).some(weight => weight && weight.trim !== '');
    
    if (!hasEnteredWeights) {
      setStatusMessage('Please enter at least one weight');
      setTimeout(() => setStatusMessage(''), 2000);
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const workoutKey = `${today}-${currentWorkout}-${Date.now()}`; // Add timestamp for uniqueness
    
    // Create new history object with the current data
    const updatedHistory = {
      ...workoutHistory,
      [workoutKey]: {
        date: today,
        type: currentWorkout,
        exercises: { ...exerciseWeights },
        timestamp: Date.now()
      }
    };
    
    setWorkoutHistory(updatedHistory);
    
    // Clear inputs after saving
    setExerciseWeights({});
    setStatusMessage('Workout saved successfully!');
    setTimeout(() => setStatusMessage(''), 2000);
    
    try {
      localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
      console.log('Saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Get dates for history selection (sorted most recent first)
  const getHistoryDates = () => {
    return Object.values(workoutHistory)
      .map(workout => workout.date)
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort()
      .reverse();
  };

  // Get workouts for a specific date
  const getWorkoutsForDate = (date) => {
    return Object.values(workoutHistory)
      .filter(workout => workout.date === date)
      .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp, newest first
  };

  // View specific workout from history
  const viewHistoryWorkout = (date, type, timestamp) => {
    const historyEntry = Object.values(workoutHistory).find(
      workout => workout.date === date && workout.type === type && workout.timestamp === timestamp
    );
    
    if (historyEntry) {
      setCurrentWorkout(type);
      setExerciseWeights(historyEntry.exercises || {});
      setViewMode('workout-detail');
    }
  };

  // Get previous weight for an exercise (for display during current workout)
  // Now shared across all workout types that use the same exercise
  const getPreviousWeight = (exerciseName) => {
    // Find the most recent workout that has a weight for this exercise, regardless of workout type
    const relevantWorkouts = Object.values(workoutHistory)
      .filter(workout => workout.exercises[exerciseName])
      .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp, newest first
    
    if (relevantWorkouts.length > 0 && relevantWorkouts[0].exercises[exerciseName]) {
      return relevantWorkouts[0].exercises[exerciseName];
    }
    return null;
  };
  
  // Get the image for an exercise
  const getExerciseImage = (exerciseName, workoutType) => {
    const exercise = initialWorkouts[workoutType].find(ex => ex.name === exerciseName);
    return exercise && exercise.image ? exercise.image : null;
  };
  
  // Get all unique exercises from all workout types
  const getAllExercises = () => {
    const allExercises = new Set();
    Object.values(initialWorkouts).forEach(exercises => {
      exercises.forEach(exercise => {
        allExercises.add(exercise.name);
      });
    });
    return Array.from(allExercises).sort();
  };
  
  // Get progress data for a specific exercise
  const getExerciseProgressData = (exerciseName) => {
    // Find all workouts that have the exercise
    const exerciseData = Object.values(workoutHistory)
      .filter(workout => workout.exercises[exerciseName])
      .map(workout => ({
        date: workout.date,
        weight: parseFloat(workout.exercises[exerciseName]),
        timestamp: workout.timestamp
      }))
      .sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp, oldest first
      
    return exerciseData;
  };
  
  // Create a chart for exercise progress
  const createChart = (canvasRef, exerciseName) => {
    if (!canvasRef || !exerciseName) return null;
    
    const progressData = getExerciseProgressData(exerciseName);
    
    if (progressData.length < 2) {
      return null; // Not enough data for a chart
    }
    
    const labels = progressData.map(item => item.date);
    const weights = progressData.map(item => item.weight);
    
    const ctx = canvasRef.getContext('2d');
    
    if (window.exerciseChart) {
      window.exerciseChart.destroy();
    }
    
    window.exerciseChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${exerciseName} Weight (kg)`,
          data: weights,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          tension: 0.1,
          fill: true,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Weight (kg)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw} kg`;
              }
            }
          }
        }
      }
    });
    
    return window.exerciseChart;
  };

  // Delete a workout
  const deleteWorkout = (date, type, timestamp) => {
    const newWorkoutHistory = { ...workoutHistory };
    
    // Find the key to delete
    const keyToDelete = Object.keys(workoutHistory).find(
      key => workoutHistory[key].date === date && 
             workoutHistory[key].type === type && 
             workoutHistory[key].timestamp === timestamp
    );
    
    if (keyToDelete) {
      delete newWorkoutHistory[keyToDelete];
      setWorkoutHistory(newWorkoutHistory);
      
      // If we were viewing the workout detail, go back to date view
      if (viewMode === 'workout-detail') {
        setViewMode('date');
      }
      
      setStatusMessage('Workout deleted');
      setTimeout(() => setStatusMessage(''), 2000);
      
      try {
        localStorage.setItem('workoutHistory', JSON.stringify(newWorkoutHistory));
      } catch (error) {
        console.error('Error saving to localStorage after delete:', error);
      }
    }
  };

  // Render component with JSX
  return React.createElement(
    'div',
    { className: "flex flex-col h-screen max-w-md mx-auto p-4 bg-gray-50" },
    [
      // Title
      React.createElement(
        'h1',
        { className: "text-2xl font-bold mb-2 text-center text-blue-800", key: "title" },
        "Workout Progress Tracker"
      ),
      
      // Storage Info
      React.createElement(
        'p',
        { className: "text-xs text-center text-gray-500 mb-3", key: "storage-info" },
        "Data stored locally on this device"
      ),
      
      // Status Message
      statusMessage && React.createElement(
        'div',
        { className: "mb-2 p-2 bg-blue-100 text-blue-800 rounded text-center", key: "status" },
        statusMessage
      ),
      
      // Mode Toggle
      React.createElement(
        'div',
        { className: "flex mb-4 justify-center", key: "mode-toggle" },
        [
          React.createElement(
            'button',
            {
              key: "track-btn",
              onClick: () => {
                setViewMode('current');
                setExerciseWeights({});
              },
              className: `px-3 py-2 rounded-l-lg ${viewMode === 'current' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`
            },
            "Track Workout"
          ),
          React.createElement(
            'button',
            {
              key: "history-btn",
              onClick: () => {
                setViewMode('history');
                setSelectedDate('');
              },
              className: `px-3 py-2 ${viewMode === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`
            },
            "History"
          ),
          React.createElement(
            'button',
            {
              key: "progress-btn",
              onClick: () => {
                setViewMode('progress');
                getAllExercises();
              },
              className: `px-3 py-2 rounded-r-lg ${viewMode === 'progress' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`
            },
            "Progress Charts"
          )
        ]
      ),

      // Current Workout View
      viewMode === 'current' && React.createElement(
        React.Fragment,
        { key: "current-view" },
        [
          // Workout Type Selector
          React.createElement(
            'div',
            { className: "mb-4", key: "workout-selector" },
            [
              React.createElement(
                'label',
                { className: "block mb-2 font-medium", key: "workout-label" },
                "Workout Type:"
              ),
              React.createElement(
                'select',
                {
                  key: "workout-select",
                  value: currentWorkout,
                  onChange: (e) => {
                    setCurrentWorkout(e.target.value);
                    setExerciseWeights({});
                  },
                  className: "w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                },
                Object.keys(initialWorkouts).map(workout => 
                  React.createElement('option', { key: workout, value: workout }, workout)
                )
              )
            ]
          ),

          // Exercise Weight Inputs
          React.createElement(
            'div',
            { className: "mb-4 overflow-y-auto flex-grow", key: "exercise-inputs" },
            [
              React.createElement(
                'h2',
                { className: "text-xl font-semibold mb-2", key: "exercises-title" },
                `${currentWorkout} Exercises`
              ),
              ...initialWorkouts[currentWorkout].map(exercise => {
                const prevWeight = getPreviousWeight(exercise.name);
                const exerciseImage = getExerciseImage(exercise.name, currentWorkout);
                
                return React.createElement(
                  'div',
                  { 
                    key: exercise.name, 
                    className: "mb-4 p-3 bg-white rounded-lg shadow"
                  },
                  React.createElement(
                    'div',
                    { className: "flex flex-col" },
                    [
                      // Exercise name and category
                      React.createElement(
                        'div',
                        { className: "mb-2", key: `${exercise.name}-header` },
                        [
                          React.createElement(
                            'label',
                            { className: "block font-medium text-lg", key: `${exercise.name}-label` },
                            exercise.name
                          ),
                          React.createElement(
                            'span',
                            { className: "text-xs text-gray-500", key: `${exercise.name}-category` },
                            exercise.category
                          )
                        ]
                      ),
                      
                      // Image and weight input
                      React.createElement(
                        'div',
                        { className: "flex flex-col sm:flex-row items-center mb-2", key: `${exercise.name}-content` },
                        [
                          // Image container
                          exerciseImage && React.createElement(
                            'div',
                            { className: "w-full sm:w-1/3 mb-2 sm:mb-0 sm:mr-3", key: `${exercise.name}-img-container` },
                            React.createElement('img', {
                              src: exerciseImage,
                              alt: exercise.name,
                              className: "w-full h-32 object-cover rounded border border-gray-200",
                              key: `${exercise.name}-img`
                            })
                          ),
                          
                          // Weight input container
                          React.createElement(
                            'div',
                            { className: "w-full sm:w-2/3", key: `${exercise.name}-input-container` },
                            React.createElement(
                              'div',
                              { className: "flex items-center mt-1 mb-2", key: `${exercise.name}-input-group` },
                              [
                                React.createElement('input', {
                                  type: "number",
                                  value: exerciseWeights[exercise.name] || '',
                                  onChange: (e) => handleWeightChange(exercise.name, e.target.value),
                                  placeholder: "Weight (kg)",
                                  className: "flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
                                  key: `${exercise.name}-input`
                                }),
                                prevWeight && React.createElement(
                                  'span',
                                  { 
                                    className: "ml-2 text-sm text-gray-500 whitespace-nowrap", 
                                    key: `${exercise.name}-prev-weight` 
                                  },
                                  `Last: ${prevWeight} kg`
                                )
                              ]
                            )
                          )
                        ]
                      )
                    ]
                  )
                );
              })
            ]
          ),

          // Save Button
          React.createElement(
            'button',
            {
              onClick: saveWorkout,
              className: "w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-200",
              key: "save-button"
            },
            "Save Workout"
          )
        ]
      ),
      
      // History View
      viewMode === 'history' && React.createElement(
        React.Fragment,
        { key: "history-view" },
        [
          React.createElement(
            'h2',
            { className: "text-xl font-semibold mb-2", key: "history-title" },
            "Workout History"
          ),
          React.createElement(
            'div',
            { className: "mb-4 overflow-y-auto flex-grow", key: "history-list" },
            getHistoryDates().length > 0 
              ? getHistoryDates().map(date => 
                  React.createElement(
                    'div',
                    {
                      key: date,
                      className: "mb-3 p-3 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100",
                      onClick: () => {
                        setSelectedDate(date);
                        setViewMode('date');
                      }
                    },
                    React.createElement(
                      'div',
                      { className: "flex justify-between items-center" },
                      [
                        React.createElement('span', { className: "font-medium", key: "date-text" }, date),
                        React.createElement(
                          'span', 
                          { className: "text-sm text-gray-500", key: "workouts-count" },
                          `${getWorkoutsForDate(date).length} workout(s)`
                        )
                      ]
                    )
                  )
                )
              : React.createElement(
                  'div',
                  { className: "text-center py-8 text-gray-500", key: "no-history" },
                  "No workout history yet. Start tracking your workouts!"
                )
          )
        ]
      ),
      
      // Date View
      viewMode === 'date' && React.createElement(
        React.Fragment,
        { key: "date-view" },
        [
          React.createElement(
            'div',
            { className: "mb-4", key: "date-header" },
            [
              React.createElement(
                'button',
                {
                  onClick: () => {
                    setSelectedDate('');
                    setViewMode('history');
                  },
                  className: "flex items-center text-blue-600",
                  key: "back-button"
                },
                [
                  React.createElement('span', { className: "mr-1", key: "back-arrow" }, "←"),
                  "Back to dates"
                ]
              ),
              React.createElement(
                'h2',
                { className: "text-xl font-semibold mt-2", key: "date-title" },
                `Workouts on ${selectedDate}`
              )
            ]
          ),
          React.createElement(
            'div',
            { className: "mb-4 overflow-y-auto flex-grow", key: "date-workouts" },
            getWorkoutsForDate(selectedDate).map(workout => 
              React.createElement(
                'div',
                {
                  key: `${workout.date}-${workout.type}-${workout.timestamp}`,
                  className: "mb-3 p-3 bg-white rounded-lg shadow"
                },
                [
                  React.createElement(
                    'div',
                    { className: "flex justify-between items-center", key: `${workout.type}-header` },
                    [
                      React.createElement('h3', { className: "font-medium", key: "workout-type" }, workout.type),
                      React.createElement(
                        'div',
                        { className: "flex", key: "workout-actions" },
                        [
                          React.createElement(
                            'button',
                            {
                              onClick: () => viewHistoryWorkout(workout.date, workout.type, workout.timestamp),
                              className: "px-2 py-1 bg-blue-100 text-blue-700 rounded mr-1 text-sm",
                              key: "view-button"
                            },
                            "View"
                          ),
                          React.createElement(
                            'button',
                            {
                              onClick: () => deleteWorkout(workout.date, workout.type, workout.timestamp),
                              className: "px-2 py-1 bg-red-100 text-red-700 rounded text-sm",
                              key: "delete-button"
                            },
                            "Delete"
                          )
                        ]
                      )
                    ]
                  ),
                  React.createElement(
                    'div',
                    { className: "text-sm text-gray-500 mt-1", key: "exercise-count" },
                    `${Object.keys(workout.exercises).filter(ex => workout.exercises[ex]).length} exercises tracked`
                  )
                ]
              )
            )
          )
        ]
      ),
      
      // Workout Detail View
      viewMode === 'workout-detail' && React.createElement(
        React.Fragment,
        { key: "workout-detail-view" },
        [
          React.createElement(
            'div',
            { className: "mb-4", key: "detail-header" },
            [
              React.createElement(
                'button',
                {
                  onClick: () => {
                    setViewMode('date');
                    setExerciseWeights({});
                  },
                  className: "flex items-center text-blue-600",
                  key: "back-to-date"
                },
                [
                  React.createElement('span', { className: "mr-1", key: "back-arrow" }, "←"),
                  "Back to workouts"
                ]
              ),
              React.createElement(
                'h2',
                { className: "text-xl font-semibold mt-2", key: "detail-title" },
                `${currentWorkout} Details`
              ),
              React.createElement(
                'div',
                { className: "text-sm text-gray-500", key: "detail-date" },
                selectedDate
              )
            ]
          ),
          React.createElement(
            'div',
            { className: "mb-4 overflow-y-auto flex-grow", key: "detail-exercises" },
            initialWorkouts[currentWorkout].map(exercise => {
              const exerciseImage = getExerciseImage(exercise.name, currentWorkout);
              
              return React.createElement(
                'div',
                { key: exercise.name, className: "mb-3 p-3 bg-white rounded-lg shadow" },
                React.createElement(
                  'div',
                  { className: "flex flex-col sm:flex-row items-center" },
                  [
                    exerciseImage && React.createElement(
                      'div',
                      { className: "w-full sm:w-1/3 mb-2 sm:mb-0 sm:mr-3", key: `${exercise.name}-img-container` },
                      React.createElement('img', {
                        src: exerciseImage,
                        alt: exercise.name,
                        className: "w-full h-24 object-cover rounded border border-gray-200",
                        key: `${exercise.name}-img`
                      })
                    ),
                    React.createElement(
                      'div',
                      { className: "w-full sm:w-2/3", key: `${exercise.name}-detail` },
                      [
                        React.createElement(
                          'div',
                          { className: "flex justify-between mb-1", key: `${exercise.name}-weight-row` },
                          [
                            React.createElement('span', { className: "font-medium", key: "name" }, exercise.name),
                            React.createElement(
                              'span',
                              { className: "text-blue-700 font-medium", key: "weight" },
                              exerciseWeights[exercise.name] ? `${exerciseWeights[exercise.name]} kg` : 'Not recorded'
                            )
                          ]
                        ),
                        React.createElement(
                          'div',
                          { className: "text-xs text-gray-500", key: "category" },
                          exercise.category
                        )
                      ]
                    )
                  ]
                )
              );
            })
          )
        ]
      ),

      // Progress Charts View
      viewMode === 'progress' && React.createElement(
        React.Fragment,
        { key: "progress-view" },
        [
          React.createElement(
            'div',
            { className: "mb-4", key: "progress-header" },
            [
              React.createElement(
                'h2',
                { className: "text-xl font-semibold mb-2", key: "progress-title" },
                "Exercise Progress Charts"
              ),
              React.createElement(
                'p',
                { className: "text-sm text-gray-500 mb-4", key: "progress-note" },
                "Select an exercise to view your weight progression over time"
              )
            ]
          ),
          React.createElement(
            'div',
            { className: "mb-4", key: "exercise-selector" },
            [
              React.createElement(
                'select',
                {
                  key: "exercise-select",
                  value: selectedExercise,
                  onChange: (e) => {
                    setSelectedExercise(e.target.value);
                  },
                  className: "w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                },
                [
                  React.createElement('option', { key: 'default', value: '' }, 'Select an exercise...'),
                  ...getAllExercises().map(exercise => 
                    React.createElement('option', { key: exercise, value: exercise }, exercise)
                  )
                ]
              )
            ]
          ),
          selectedExercise && React.createElement(
            'div',
            { className: "mb-4 p-4 bg-white rounded-lg shadow", key: "chart-container" },
            [
              React.createElement(
                'h3',
                { className: "text-lg font-medium mb-2", key: "exercise-name" },
                selectedExercise
              ),
              React.createElement(
                'div',
                { className: "stats-summary mb-4", key: "stats-summary" },
                () => {
                  const progressData = getExerciseProgressData(selectedExercise);
                  if (progressData.length > 0) {
                    const maxWeight = Math.max(...progressData.map(d => d.weight));
                    const minWeight = Math.min(...progressData.map(d => d.weight));
                    const currentWeight = progressData[progressData.length - 1].weight;
                    const firstWeight = progressData[0].weight;
                    const improvement = currentWeight - firstWeight;
                    const improvementPct = ((improvement / firstWeight) * 100).toFixed(1);
                    
                    return React.createElement(
                      'div',
                      { className: "grid grid-cols-2 gap-2 text-sm" },
                      [
                        React.createElement(
                          'div',
                          { className: "p-2 bg-blue-50 rounded", key: "current" },
                          [
                            React.createElement('span', { className: "block text-xs text-gray-500" }, "Current"),
                            React.createElement('span', { className: "font-medium" }, `${currentWeight} kg`)
                          ]
                        ),
                        React.createElement(
                          'div',
                          { className: "p-2 bg-green-50 rounded", key: "improvement" },
                          [
                            React.createElement('span', { className: "block text-xs text-gray-500" }, "Improvement"),
                            React.createElement(
                              'span', 
                              { className: improvement >= 0 ? "font-medium text-green-600" : "font-medium text-red-600" },
                              `${improvement > 0 ? '+' : ''}${improvement} kg (${improvementPct}%)`
                            )
                          ]
                        ),
                        React.createElement(
                          'div',
                          { className: "p-2 bg-blue-50 rounded", key: "max" },
                          [
                            React.createElement('span', { className: "block text-xs text-gray-500" }, "Max Weight"),
                            React.createElement('span', { className: "font-medium" }, `${maxWeight} kg`)
                          ]
                        ),
                        React.createElement(
                          'div',
                          { className: "p-2 bg-blue-50 rounded", key: "sessions" },
                          [
                            React.createElement('span', { className: "block text-xs text-gray-500" }, "Sessions"),
                            React.createElement('span', { className: "font-medium" }, progressData.length)
                          ]
                        )
                      ]
                    );
                  }
                  return React.createElement('p', { className: "text-gray-500" }, "No data available");
                }
              ),
              React.createElement(
                'div',
                { className: "relative h-64", key: "chart" },
                React.createElement('canvas', {
                  ref: (el) => {
                    if (el && selectedExercise) {
                      setTimeout(() => createChart(el, selectedExercise), 0);
                    }
                  },
                  className: "w-full h-full"
                })
              ),
              getExerciseProgressData(selectedExercise).length < 2 && React.createElement(
                'p',
                { className: "text-center text-gray-500 mt-2", key: "not-enough-data" },
                "Not enough data to display a chart. Add more workouts."
              )
            ]
          ),
          !selectedExercise && React.createElement(
            'div',
            { className: "text-center py-8 text-gray-500 bg-white rounded-lg shadow", key: "no-selection" },
            "Select an exercise to view progress charts"
          )
        ]
      )
    ]
  );
};

// Render the app to the DOM
ReactDOM.render(
  React.createElement(WorkoutTracker),
  document.getElementById('root')
);