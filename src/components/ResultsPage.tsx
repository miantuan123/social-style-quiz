import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { subscribeToSession } from "../services/firebaseService";
import type { SessionData } from "../types";
import { Share2, Home } from "lucide-react";
import SocialStyleGraph from "./SocialStyleGraph";

const ResultsPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { name, result, sessionCode } = location.state || {};

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!submissionId || !sessionCode) {
      navigate("/");
      return;
    }

    const unsubscribe = subscribeToSession(sessionCode, (data) => {
      setSessionData(data);
    });

    return () => unsubscribe();
  }, [submissionId, sessionCode, navigate]);

  const handleShare = async () => {
    const url = `${window.location.origin}/results/${submissionId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Social Style Quiz Results",
          text: `Check out the results from our Social Style Quiz session: ${sessionCode}`,
          url: url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      setShowShareModal(true);
    }
  };

  const copyToClipboard = async () => {
    const url = `${window.location.origin}/results/${sessionCode}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
      setShowShareModal(false);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (!result || !sessionCode) {
    return null;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
              <p className="text-gray-600">Session: {sessionCode}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Personal Results */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Your Results
            </h2>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {result.socialStyle}
              </div>
              <p className="text-gray-600">Your Social Style</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Communication Style
                </h3>
                <div className="flex justify-between text-sm">
                  <span>Tell (A): {result.firstHalf.a}</span>
                  <span>Ask (B): {result.firstHalf.b}</span>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Difference: {result.firstHalf.difference}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Emotional Expression
                </h3>
                <div className="flex justify-between text-sm">
                  <span>Emotes (C): {result.secondHalf.c}</span>
                  <span>Controls (D): {result.secondHalf.d}</span>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Difference: {result.secondHalf.difference}
                </div>
              </div>
            </div>
          </div>

          {/* Graph */}
          <div className="bg-white rounded-2xl shadow-xl p-6 overflow-visible">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Session Results
            </h2>
            <SocialStyleGraph
              results={sessionData?.results || []}
              submissions={sessionData?.submissions || []}
              currentUserResult={result}
              currentUserName={name}
            />
          </div>
        </div>

        {/* Participants List */}
        {sessionData && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Participants ({sessionData.submissions.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessionData.submissions.map((submission, index) => {
                const subResult = sessionData.results[index];
                return (
                  <div
                    key={submission.id}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="font-medium text-gray-900">
                      {submission.name}
                    </div>
                    <div className="text-sm text-blue-600">
                      {subResult.socialStyle}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      A:{subResult.firstHalf.a} B:{subResult.firstHalf.b} | C:
                      {subResult.secondHalf.c} D:{subResult.secondHalf.d}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Share Results
            </h3>
            <p className="text-gray-600 mb-4">
              Share this link with others to view the session results:
            </p>
            <div className="bg-gray-100 p-3 rounded-lg mb-4 break-all text-sm">
              {`${window.location.origin}/results/${submissionId}`}
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

export default ResultsPage;
