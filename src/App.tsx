import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import ResultsPage from './components/ResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz/:sessionCode" element={<QuizPage />} />
        <Route path="/results/:sessionCode" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
