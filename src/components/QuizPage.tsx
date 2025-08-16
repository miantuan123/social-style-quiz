import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { questions } from "../constants/questions";
import { createSubmission } from "../services/firebaseService";
import { calculateQuizResult } from "../utils/quizUtils";

const QuizPage: React.FC = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { name } = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!name || !sessionCode) {
      navigate("/");
    }
  }, [name, sessionCode, navigate]);

  const handleAnswer = (answer: string) => {
    const questionNumber = currentQuestion + 1;
    setAnswers((prev) => ({
      ...prev,
      [`q${questionNumber}`]: answer,
    }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionId = await createSubmission(sessionCode!, name, answers);
      const result = calculateQuizResult(answers);
      navigate(`/results/${submissionId}`, {
        state: {
          name,
          sessionCode,
          result,
          answers,
          submissionId,
        },
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const hasAnswered = answers[`q${currentQuestion + 1}`];
  const isLastQuestion = currentQuestion === questions.length - 1;

  if (!name || !sessionCode) {
    return null;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Social Style Quiz
              </h1>
              <p className="text-gray-600">Session: {sessionCode}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Question</p>
              <p className="text-2xl font-bold text-blue-600">
                {currentQuestion + 1} / {questions.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-8 text-center">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {Object.entries(currentQ.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleAnswer(key)}
                className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  answers[`q${currentQuestion + 1}`] === key
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                      answers[`q${currentQuestion + 1}`] === key
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {answers[`q${currentQuestion + 1}`] === key && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">{value}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {isLastQuestion && (
              <button
                onClick={handleSubmit}
                disabled={!hasAnswered || isSubmitting}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
