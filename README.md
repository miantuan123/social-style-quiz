# Social Style Quiz

A mobile-responsive React webapp for conducting social style assessments with real-time results visualization.

## Features

- **20-question social style assessment** with 4 distinct personality types
- **Real-time results visualization** using Firebase Firestore
- **Session-based quiz system** with unique session codes
- **Mobile-responsive design** built with Tailwind CSS
- **Interactive results graph** showing participant distribution
- **Share functionality** for results and session links

## Social Styles

The quiz categorizes participants into 4 social styles based on their communication and emotional expression preferences:

- **Expressive (AC)**: Tell + Emotes - Outgoing, enthusiastic, and emotionally expressive
- **Amiable (BC)**: Ask + Emotes - Collaborative, supportive, and emotionally open
- **Driver (AD)**: Tell + Controls - Direct, decisive, and emotionally controlled
- **Analyser (BD)**: Ask + Controls - Thoughtful, analytical, and emotionally reserved

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase Firestore
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd social-style-quiz
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Create a web app in your Firebase project
4. Copy the Firebase configuration

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Firestore Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{document} {
      allow read, write: if true; // For demo purposes - adjust for production
    }
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase project:
```bash
firebase init hosting
```

4. Build the project:
```bash
npm run build
```

5. Deploy:
```bash
firebase deploy
```

### Alternative: Vercel/Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your preferred hosting platform

## Project Structure

```
src/
├── components/          # React components
│   ├── HomePage.tsx    # Landing page with session management
│   ├── QuizPage.tsx    # Quiz interface
│   └── ResultsPage.tsx # Results display with graph
├── constants/          # Application constants
│   └── questions.ts    # Quiz questions and social style mappings
├── lib/               # External library configurations
│   └── firebase.ts    # Firebase initialization
├── services/          # API and service functions
│   └── firebaseService.ts # Firestore operations
├── types/             # TypeScript type definitions
│   └── index.ts       # Application types
├── utils/             # Utility functions
│   └── quizUtils.ts   # Quiz calculation logic
└── App.tsx            # Main application component
```

## Usage

### For Participants

1. Visit the application
2. Enter your name and session code (or create a new session)
3. Answer 20 questions about your communication and emotional preferences
4. View your results and see how you compare to others in the session
5. Share the results link with others

### For Session Organizers

1. Create a new session to get a unique session code
2. Share the session code with participants
3. Monitor real-time results as participants complete the quiz
4. Use the results for team building, communication training, or personality assessments

## Quiz Logic

The quiz uses a two-dimensional assessment:

1. **Communication Style (Questions 1-10)**:
   - A (Tell): Direct, assertive communication
   - B (Ask): Collaborative, inquiry-based communication

2. **Emotional Expression (Questions 11-20)**:
   - C (Emotes): Open emotional expression
   - D (Controls): Controlled emotional expression

Results are calculated by:
- Counting responses for each dimension
- Calculating the difference between dominant and non-dominant styles
- Plotting results on a coordinate system for visualization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
