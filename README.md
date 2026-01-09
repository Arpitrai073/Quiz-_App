# Quiz Application

A modern, responsive quiz application built with React, TypeScript, and Vite. This application allows users to take a timed quiz with 15 questions fetched from the Open Trivia Database API.

## Overview

This quiz application was built as a coding assignment for CausalFunnel. It features a clean, user-friendly interface with smooth animations and a comprehensive quiz-taking experience.

### Key Features

- **Start Page**: Email validation and quiz initialization
- **Quiz Page**: 
  - 30-minute countdown timer with visual warnings
  - 15 questions with shuffled answer options
  - Question navigation (Previous/Next buttons)
  - Question overview panel showing:
    - Current question
    - Answered questions
    - Visited questions
    - Unvisited questions
  - Auto-submit when timer reaches zero
- **Report Page**: 
  - Score summary with percentage
  - Detailed results for each question
  - Side-by-side comparison of user answers and correct answers
  - Visual indicators for correct/incorrect answers

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **CSS3** - Styling with animations and responsive design

## Project Structure

```
src/
├── context/
│   └── QuizContext.tsx      # Global state management
├── pages/
│   ├── StartPage.tsx        # Email input and quiz start
│   ├── StartPage.css
│   ├── QuizPage.tsx         # Main quiz interface
│   ├── QuizPage.css
│   ├── ReportPage.tsx       # Results display
│   └── ReportPage.css
├── utils/
│   ├── api.ts               # API integration
│   └── utils.ts             # Helper functions
├── types.ts                 # TypeScript type definitions
├── App.tsx                  # Main app component with routing
├── main.tsx                 # Application entry point
└── index.css                # Global styles
```

## Setup and Installation

### Prerequisites

- Node.js (v20.19.0 or >=22.12.0 recommended)
- npm or yarn

### Installation Steps

1. Clone the repository or navigate to the project directory:
   ```bash
   cd Quiz
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build with:

```bash
npm run preview
```

## Approach and Components

### State Management

The application uses React Context API for global state management. The `QuizContext` provides:
- Quiz questions and user answers
- Email address
- Timer state
- Visited questions tracking
- Helper functions for state updates

### Component Architecture

1. **StartPage**: Handles email validation and fetches quiz questions from the API
2. **QuizPage**: Main quiz interface with timer, question display, and navigation
3. **ReportPage**: Displays results with detailed answer comparisons

### Key Utilities

- **HTML Decoding**: The API returns HTML entities, which are decoded for proper display
- **Answer Shuffling**: Answers are shuffled using Fisher-Yates algorithm for each question
- **Timer Management**: Countdown timer with auto-submit functionality

## Assumptions

1. The Open Trivia Database API will always return exactly 15 questions
2. Users have a stable internet connection for API calls
3. The timer continues running even if the user navigates away (browser tab behavior)
4. Email validation follows standard email format rules
5. All questions are multiple choice (as per the API response structure)

## Challenges and Solutions

### Challenge 1: HTML Entity Decoding
**Problem**: The API returns questions and answers with HTML entities (e.g., `&quot;`, `&#039;`).

**Solution**: Created a `decodeHtml` utility function that uses a temporary textarea element to decode HTML entities.

### Challenge 2: Timer State Management
**Problem**: Managing timer state across component re-renders while ensuring accurate countdown.

**Solution**: Used React's `useEffect` with proper cleanup and state updater functions to maintain timer accuracy.

### Challenge 3: Answer Shuffling
**Problem**: Ensuring answers are shuffled for each question without causing unnecessary re-renders.

**Solution**: Used `useMemo` to memoize shuffled answers, recalculating only when the current question changes.

### Challenge 4: Question Navigation State
**Problem**: Tracking which questions have been visited and answered for the overview panel.

**Solution**: Used `Set` and `Map` data structures in the context state to efficiently track visited and answered questions.

## Browser Compatibility

The application is tested and compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Design

The application is fully responsive and adapts to different screen sizes:
- Desktop: Full layout with side-by-side question and overview panels
- Tablet: Stacked layout with optimized spacing
- Mobile: Single column layout with touch-friendly buttons

## Additional Features (Bonus)

- ✅ Responsive design for all device sizes
- ✅ Smooth transitions and animations
- ✅ Visual timer warning when less than 5 minutes remain
- ✅ Color-coded question overview panel
- ✅ Detailed answer comparison in results
- ✅ Modern gradient UI design
- ✅ Loading states and error handling

## Deployment

The application can be deployed to various platforms:

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects for client-side routing (add `_redirects` file with `/* /index.html 200`)

### Vercel
1. Connect your repository to Vercel
2. Vercel will automatically detect Vite and configure the build
3. Deploy with default settings

### GitHub Pages
1. Install `gh-pages`: `npm install --save-dev gh-pages`
2. Add to `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
3. Run `npm run deploy`

## License

This project was created as a coding assignment for CausalFunnel.

