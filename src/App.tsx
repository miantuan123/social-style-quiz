import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import ResultsPage from './components/ResultsPage';
import SessionPage from './components/SessionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz/:sessionCode" element={<QuizPage />} />
        <Route path="/results/:submissionId" element={<ResultsPage />} />
        <Route path="/session/:sessionCode" element={<SessionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
