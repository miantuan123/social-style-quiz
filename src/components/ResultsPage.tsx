import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { subscribeToSession } from "../services/firebaseService";
import type { SessionData, Submission } from "../types/index";
import { Home } from "lucide-react"; // Added Info icon
import SocialStyleGraph from "./SocialStyleGraph";
import SocialStyleSection from "./SocialStyleSection";

const ResultsPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { name, result, sessionCode } = location.state || {};

  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    if (!submissionId || !sessionCode) {
      navigate("/");
      return;
    }

    const unsubscribe = subscribeToSession(sessionCode, (data) => {
      setSessionData((prev) => ({
        session_code: data.session_code || prev?.session_code || sessionCode,
        submissions: data.submissions.length ? data.submissions : prev?.submissions || [],
        results: data.results.length ? data.results : prev?.results || [],
        showResults: typeof data.showResults === 'boolean' ? data.showResults : prev?.showResults,
        showDriver: typeof (data as any).showDriver === 'boolean' ? (data as any).showDriver : prev?.showDriver,
        showExpressive: typeof (data as any).showExpressive === 'boolean' ? (data as any).showExpressive : prev?.showExpressive,
        showAnalyser: typeof (data as any).showAnalyser === 'boolean' ? (data as any).showAnalyser : prev?.showAnalyser,
        showAmiable: typeof (data as any).showAmiable === 'boolean' ? (data as any).showAmiable : prev?.showAmiable,
      } as SessionData));
    });

    return () => unsubscribe();
  }, [submissionId, sessionCode, navigate]);

  // const handleShare = async () => {
  //   copyToClipboard();
  // };

  // const copyToClipboard = async () => {
  //   const url = `${window.location.origin}/results/${submissionId}`; // Changed from sessionCode to submissionId
  //   try {
  //     await navigator.clipboard.writeText(url);
  //     setShowCopiedAlert(true);
  //     setTimeout(() => setShowCopiedAlert(false), 3000);
  //     setShowShareModal(false);
  //   } catch (error) {
  //     console.error("Failed to copy:", error);
  //   }
  // };

  if (!result || !sessionCode) {
    return null;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="!text-xl font-bold text-gray-900">Quiz Results</h1>
              <p className="text-gray-600">Session: {sessionCode}</p>
            </div>
            <div className="flex flex-col space-y-2">
              {" "}
              {/* Changed from flex-row to flex-col */}
              {/* <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 !bg-brand-500 text-white rounded-lg hover:!bg-brand-700 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button> */}
              <button
                onClick={() => navigate("/")}
                className="flex items-center px-4 py-2 bg-white-200 text-brand-700 rounded-lg hover:bg-brand-300 transition-colors !border-brand-500"
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
              Your Social Style is...
            </h2>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-brand-600 mb-2">
                {result.socialStyle}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Assertiveness
                </h3>
                <div className="flex justify-between text-sm">
                  <span>Tells more: {result.firstHalf.a}</span>
                  <span>Asks more: {result.firstHalf.b}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Responsiveness
                </h3>
                <div className="flex justify-between text-sm">
                  <span>People focused: {result.secondHalf.c}</span>
                  <span>Task focused: {result.secondHalf.d}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Graph (collapsible) */}
          <div className="bg-white rounded-2xl shadow-xl p-6 overflow-visible">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Session Results</h2>
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                sessionData?.showResults ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
              }`}
              aria-hidden={!sessionData?.showResults}
            >
              <div className="pt-4">
                <SocialStyleGraph
                  results={sessionData?.results || []}
                  submissions={sessionData?.submissions || []}
                  currentUserResult={result}
                  currentUserName={name}
                />
              </div>
            </div>
          </div>
          
        </div>
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <SocialStyleSection
                styleName="Driver"
                results={sessionData?.results || []}
                submissions={sessionData?.submissions || []}
                isExpanded={sessionData?.showDriver || false}
                onToggle={() => {}}
                showToggle={false}
              />
            <SocialStyleSection
                styleName="Expressive"
                results={sessionData?.results || []}
                submissions={sessionData?.submissions || []}
                isExpanded={sessionData?.showExpressive || false}
                onToggle={() => {}}
                showToggle={false}
              />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
        <SocialStyleSection
                styleName="Analyser"
                results={sessionData?.results || []}
                submissions={sessionData?.submissions || []}
                isExpanded={sessionData?.showAnalyser || false}
                onToggle={() => {}}
                showToggle={false}
              />
            <SocialStyleSection
                styleName="Amiable"
                results={sessionData?.results || []}
                submissions={sessionData?.submissions || []}
                isExpanded={sessionData?.showAmiable || false}
                onToggle={() => {}}
                showToggle={false}
              />
        </div>

        {/* Participants List (collapsible) */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Participants ({sessionData?.submissions.length || 0})
          </h2>
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              sessionData?.showResults && sessionData && sessionData.submissions.length > 0
                ? "max-h-[1200px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
            aria-hidden={!(sessionData?.showResults && !!(sessionData && sessionData.submissions.length > 0))}
          >
            <div className="pt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessionData &&
                sessionData.submissions.map((submission: Submission, index: number) => {
                  const subResult = sessionData.results[index];
                  return (
                    <div
                      key={submission.id}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="font-medium text-gray-900">
                        {submission.name}
                      </div>
                      <div className="text-sm text-brand-600">
                        {subResult.socialStyle}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
