import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { generateSessionCode } from "../utils/quizUtils";
import { checkSessionExists, createSession } from "../services/firebaseService";

const HomePage: React.FC = () => {
  const [sessionCode, setSessionCode] = useState("");
  const [name, setName] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("session_code");
    if (code) {
      setSessionCode(code.toUpperCase());
      setShowJoinForm(true);
    }
  }, [location.search]);

  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionCode.trim() || !name.trim()) return;

    setIsValidating(true);
    setValidationError("");
    
    try {
      const exists = await checkSessionExists(sessionCode);
      if (!exists) {
        setValidationError("Invalid session code. Please check and try again.");
        return;
      }
      navigate(`/quiz/${sessionCode}`, {
        state: { name, sessionCode },
      });
    } catch (error) {
      console.error("Error validating session:", error);
      setValidationError("Error validating session. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleCreateSession = () => {
    const code = generateSessionCode();
    createSession(code);
    navigate(`/session/${code}`, {
      state: { sessionCode: code },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Social Style Quiz
          </h1>
          <p className="text-gray-600">
            Discover your communication and interaction style
          </p>
        </div>

        <div className="space-y-6">
          {!showJoinForm ? (
            <div className="space-y-4">
              <button
                onClick={() => setShowJoinForm(true)}
                className="w-full py-3 px-4 rounded-lg font-medium !bg-white hover:!bg-brand-100 text-brand-500 !border-brand-500"
              >
                Join Session
              </button>

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
                className="w-full !bg-brand-500 text-white hover:!bg-brand-700 py-3 px-4 rounded-lg transition-colors font-medium"
              >
                Create New Session
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleJoinSession} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
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
                  <label
                    htmlFor="sessionCode"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Session Code
                  </label>
                  <input
                    type="text"
                    id="sessionCode"
                    value={sessionCode}
                    onChange={(e) => {
                      setSessionCode(e.target.value.toUpperCase());
                      setValidationError("");
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter session code"
                    required
                  />
                  {validationError && (
                    <p className="mt-1 text-sm text-red-600">{validationError}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isValidating}
                    className={`w-full py-3 px-4 rounded-lg transition-colors font-medium !bg-brand-500 text-white hover:!bg-brand-700 ${
                      isValidating ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isValidating ? "Validating..." : "Continue"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowJoinForm(false);
                      setName("");
                      setSessionCode("");
                    }}
                    className="w-full py-3 px-4 rounded-lg transition-colors font-medium !bg-white hover:!bg-brand-100 text-brand-500 !border-brand-500"
                  >
                    Back
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
