# FIFI Workout Tracker Guide

## Project Structure
- Single-page React application using React 17
- Direct browser script loading (no build system)
- Data stored in localStorage (persistent across browser sessions)
- Chart.js for workout progress visualization

## Development
- Open `index.html` in a browser to view the application
- No build/compile step required
- Edit `script.js` directly and refresh browser
- Data persists between sessions (stored in browser's localStorage)

## Code Style
- Use React functional components with hooks (useState, useEffect)
- Follow camelCase for variable and function names
- Use descriptive variable names (exerciseWeights vs weights)
- Component structure: state declarations → effects → helper functions → render
- Helper functions should be pure when possible
- Error handling with try/catch for localStorage operations
- Use object destructuring for props
- Add comments for non-obvious logic

## Data Structure
- Workouts stored as objects with date, type, exercises, and timestamp
- Exercise data includes name, image (optional), and category
- Weight history tracked per exercise name across all workout types
- Charts display progression of weights over time for each exercise