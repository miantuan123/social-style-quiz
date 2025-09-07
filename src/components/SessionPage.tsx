import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subscribeToSession, setSessionShowResults, setSessionShowStyle } from "../services/firebaseService";
import type { SessionData, Submission } from "../types/index";
import { Home } from "lucide-react";
import SocialStyleSection from "./SocialStyleSection";
import SocialStyleGraph from "./SocialStyleGraph";
import QRCode from "qrcode";

const SessionPage: React.FC = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const navigate = useNavigate();
  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);


  useEffect(() => {
    if (!sessionCode) {
      navigate("/");
      return;
    }

    console.log(`Setting up listener for session: ${sessionCode}`);
    const unsubscribe = subscribeToSession(sessionCode, (data) => {
      console.log(
        `SessionPage received data for session ${sessionCode}:`,
        data
      );
      // Merge showResults flag when we receive a lightweight update
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
      if (typeof data.showResults === 'boolean') {
        setShowResults(data.showResults);
      }
    });

    return () => unsubscribe();
  }, [sessionCode, navigate]);

  useEffect(() => {
    if (qrCodeRef.current) {
      const url = `${window.location.origin}/?session_code=${sessionCode}`;
      QRCode.toCanvas(qrCodeRef.current, url, {
        width: 240,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
    }
  }, [sessionCode]);

  // const copyToClipboard = async () => {
  //   const url = `${window.location.origin}/?session_code=${sessionCode}`;
  //   try {
  //     await navigator.clipboard.writeText(url);
  //     alert("Link copied to clipboard!");
  //   } catch (error) {
  //     console.error("Failed to copy:", error);
  //   }
  // };

  if (!sessionCode) {
    return null;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with buttons below title */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Session Results
          </h1>
          <div className="flex space-x-3 mb-6">
            <button
              onClick={async () => {
                const next = !showResults;
                setShowResults(next);
                if (sessionCode) {
                  try { await setSessionShowResults(sessionCode, next); } catch (e) { console.error(e); }
                }
              }}
              className="flex items-center px-4 py-2 !bg-brand-500 text-white rounded-lg hover:!bg-brand-700 transition-colors"
            >
              {showResults ? "Hide Results" : "Show Results"}
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center px-4 py-2 bg-white-200 !border-brand-500 text-brand-700 rounded-lg hover:bg-brand-300 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </button>
          </div>

          {/* Session info and QR code */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-lg font-semibold">
                Session Code:{" "}
                <span className="font-bold text-xl">{sessionCode}</span>
              </p>
              <p className="text-sm text-gray-500">
                {sessionData?.submissions.length || 0} participants
              </p>
            </div>
            <div className="flex flex-col items-center">
              <canvas
                ref={qrCodeRef}
                className="mb-2"
                width={240} // Added explicit width
                height={240} // Added explicit height
              />
              <p className="text-sm text-gray-600">Scan to join</p>
            </div>
          </div>
        </div>

        {/* Global Live Results Graph (collapsible) */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Overall Results</h2>
          <div
            id="live-results"
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showResults ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
            }`}
            aria-hidden={!showResults}
          >
            <div className="pt-4">
              <SocialStyleGraph
                results={sessionData?.results || []}
                submissions={sessionData?.submissions || []}
              />
            </div>
          </div>
        </div>

        {/* Participants List */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Participants ({sessionData?.submissions.length || 0})
          </h2>
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showResults && sessionData && sessionData.submissions.length > 0
                ? "max-h-[1200px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
            aria-hidden={!(showResults && !!(sessionData && sessionData.submissions.length > 0))}
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

        {/* Social Style Sections */}
        <div className="space-y-4 mt-6">
          <SocialStyleSection
            styleName="Driver"
            results={sessionData?.results || []}
            submissions={sessionData?.submissions || []}
            isExpanded={sessionData?.showDriver || false}
            onToggle={async () => {
              if (sessionCode) {
                try { await setSessionShowStyle(sessionCode, 'Driver', !(sessionData?.showDriver)); } catch (e) { console.error(e); }
              }
            }}
            centerContent
          />
          <SocialStyleSection
            styleName="Expressive"
            results={sessionData?.results || []}
            submissions={sessionData?.submissions || []}
            isExpanded={sessionData?.showExpressive || false}
            onToggle={async () => {
              if (sessionCode) {
                try { await setSessionShowStyle(sessionCode, 'Expressive', !(sessionData?.showExpressive)); } catch (e) { console.error(e); }
              }
            }}
            centerContent
          />
          <SocialStyleSection
            styleName="Analyser"
            results={sessionData?.results || []}
            submissions={sessionData?.submissions || []}
            isExpanded={sessionData?.showAnalyser || false}
            onToggle={async () => {
              if (sessionCode) {
                try { await setSessionShowStyle(sessionCode, 'Analyser', !(sessionData?.showAnalyser)); } catch (e) { console.error(e); }
              }
            }}
            centerContent
          />
          <SocialStyleSection
            styleName="Amiable"
            results={sessionData?.results || []}
            submissions={sessionData?.submissions || []}
            isExpanded={sessionData?.showAmiable || false}
            onToggle={async () => {
              if (sessionCode) {
                try { await setSessionShowStyle(sessionCode, 'Amiable', !(sessionData?.showAmiable)); } catch (e) { console.error(e); }
              }
            }}
            centerContent
          />
        </div>
      </div>


    </div>
  );
};

export default SessionPage;
