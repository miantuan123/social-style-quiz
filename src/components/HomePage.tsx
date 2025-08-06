import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSessionCode } from '../utils/quizUtils';

const HomePage: React.FC = () => {
  const [sessionCode, setSessionCode] = useState('');
  const [name, setName] = useState('');
  const [newSessionCode, setNewSessionCode] = useState('');
  const [showNewSession, setShowNewSession] = useState(false);
  const navigate = useNavigate();

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionCode.trim() && name.trim()) {
      navigate(`/quiz/${sessionCode}`, { 
        state: { name, sessionCode } 
      });
    }
  };

  const handleCreateSession = () => {
    const code = generateSessionCode();
    setNewSessionCode(code);
    setShowNewSession(true);
  };

  const handleStartNewSession = () => {
    if (name.trim()) {
      navigate(`/quiz/${newSessionCode}`, { 
        state: { name, sessionCode: newSessionCode } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Social Style Quiz
          </h1>
          <p className="text-gray-600">
            Discover your communication and interaction style
          </p>
        </div>

        {!showNewSession ? (
          <div className="space-y-6">
            <form onSubmit={handleJoinSession} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="sessionCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Code
                </label>
                <input
                  type="text"
                  id="sessionCode"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter session code"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Join Session
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <button
              onClick={handleCreateSession}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Create New Session
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                New Session Created!
              </h2>
              <p className="text-gray-600 mb-4">
                Share this code with others to join your session:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <span className="text-2xl font-mono font-bold text-gray-900">
                  {newSessionCode}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="newName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={handleStartNewSession}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Quiz
              </button>
              
              <button
                onClick={() => setShowNewSession(false)}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 