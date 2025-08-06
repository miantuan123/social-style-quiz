import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscribeToSession } from '../services/firebaseService';
import type { SessionData } from '../types';
import { Share2, Home, Users } from 'lucide-react';

const SessionPage: React.FC = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const navigate = useNavigate();
  
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!sessionCode) {
      navigate('/');
      return;
    }

    const unsubscribe = subscribeToSession(sessionCode, (data) => {
      setSessionData(data);
    });

    return () => unsubscribe();
  }, [sessionCode, navigate]);

  const handleShare = async () => {
    const url = `${window.location.origin}/session/${sessionCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Social Style Quiz Session',
          text: `Join our Social Style Quiz session: ${sessionCode}`,
          url: url
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = async () => {
    const url = `${window.location.origin}/session/${sessionCode}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
      setShowShareModal(false);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!sessionCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Session Results</h1>
              <p className="text-gray-600">Session Code: {sessionCode}</p>
              <p className="text-sm text-gray-500">
                {sessionData?.submissions.length || 0} participants
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Session
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
            </div>
          </div>
        </div>

        {/* Live Results Graph */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Live Results</h2>
          <div className="relative w-full h-80 bg-gray-50 rounded-lg border-2 border-gray-200">
            {/* Graph Grid */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full relative">
                {/* Vertical line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-px"></div>
                {/* Horizontal line */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 transform -translate-y-px"></div>
                
                {/* Quadrant Labels */}
                <div className="absolute top-2 left-2 text-xs font-medium text-gray-600">C (Emotes)</div>
                <div className="absolute top-2 right-2 text-xs font-medium text-gray-600">C (Emotes)</div>
                <div className="absolute bottom-2 left-2 text-xs font-medium text-gray-600">D (Controls)</div>
                <div className="absolute bottom-2 right-2 text-xs font-medium text-gray-600">D (Controls)</div>
                <div className="absolute top-1/2 left-2 text-xs font-medium text-gray-600 transform -translate-y-1/2">A (Tell)</div>
                <div className="absolute top-1/2 right-2 text-xs font-medium text-gray-600 transform -translate-y-1/2">B (Ask)</div>
                
                {/* Quadrant Names */}
                <div className="absolute top-4 left-4 text-sm font-semibold text-blue-600">Expressive</div>
                <div className="absolute top-4 right-4 text-sm font-semibold text-green-600">Facilitator</div>
                <div className="absolute bottom-4 left-4 text-sm font-semibold text-red-600">Driver</div>
                <div className="absolute bottom-4 right-4 text-sm font-semibold text-purple-600">Analyser</div>
              </div>
            </div>

            {/* Data Points */}
            {sessionData?.results.map((res, index) => {
              const x = ((res.coordinates.x + 5) / 10) * 100;
              const y = ((res.coordinates.y + 5) / 10) * 100;
              
              return (
                <div
                  key={index}
                  className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-2 -translate-y-2 border-2 border-white shadow-lg"
                  style={{
                    left: `${x}%`,
                    top: `${100 - y}%`
                  }}
                  title={`${sessionData.submissions[index]?.name || 'Unknown'}: ${res.socialStyle}`}
                />
              );
            })}

            {/* No results message */}
            {(!sessionData || sessionData.results.length === 0) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No results yet</p>
                  <p className="text-sm">Share the session code to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Participants List */}
        {sessionData && sessionData.submissions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Participants ({sessionData.submissions.length})</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessionData.submissions.map((submission, index) => {
                const subResult = sessionData.results[index];
                return (
                  <div key={submission.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium text-gray-900">{submission.name}</div>
                    <div className="text-sm text-blue-600">{subResult.socialStyle}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      A:{subResult.firstHalf.a} B:{subResult.firstHalf.b} | C:{subResult.secondHalf.c} D:{subResult.secondHalf.d}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Join Session Button */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Join This Session</h3>
            <p className="text-gray-600 mb-4">
              Take the quiz to see your results on this graph
            </p>
            <button
              onClick={() => navigate(`/quiz/${sessionCode}`, { state: { sessionCode } })}
              className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share Session</h3>
            <p className="text-gray-600 mb-4">
              Share this link with others to join the session:
            </p>
            <div className="bg-gray-100 p-3 rounded-lg mb-4 break-all text-sm">
              {`${window.location.origin}/session/${sessionCode}`}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionPage; 