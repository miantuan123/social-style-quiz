import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subscribeToSession } from "../services/firebaseService";
import type { SessionData, Submission } from "../types/index";
import { Home } from "lucide-react";
import SocialStyleGraph from "./SocialStyleGraph";
import QRCode from "qrcode";

const SessionPage: React.FC = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const navigate = useNavigate();
  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  const [sessionData, setSessionData] = useState<SessionData | null>(null);


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
      setSessionData(data);
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

        {/* Live Results Graph */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Live Results</h2>
          <SocialStyleGraph
            results={sessionData?.results || []}
            submissions={sessionData?.submissions || []}
          />
        </div>

        {/* Participants List */}
        {sessionData && sessionData.submissions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Participants ({sessionData.submissions.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessionData.submissions.map((submission: Submission, index: number) => {
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
                    {/* <div className="text-xs text-gray-500 mt-1">
                      A:{subResult.firstHalf.a} B:{subResult.firstHalf.b} | C:
                      {subResult.secondHalf.c} D:{subResult.secondHalf.d}
                    </div> */}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default SessionPage;
