import React from "react";
import type { QuizResult } from "../types/index";
import DriverGraph from "./DriverGraph";
import ExpressiveGraph from "./ExpressiveGraph";
import AnalyserGraph from "./AnalyserGraph";
import AmiableGraph from "./AmiableGraph";

interface SocialStyleSectionProps {
  styleName: string;
  results: QuizResult[];
  submissions: Array<{ id: string; name: string }>;
  isExpanded: boolean;
  onToggle: () => void;
  showToggle?: boolean;
  centerContent?: boolean;
}

const SocialStyleSection: React.FC<SocialStyleSectionProps> = ({
  styleName,
  results,
  submissions,
  isExpanded,
  onToggle,
  showToggle = true,
  centerContent = false,
}) => {
  const filteredResults = results.filter(r => r.socialStyle === styleName);
  const filteredSubmissions = submissions.filter((_, i) => 
    results[i]?.socialStyle === styleName
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      <div
        className={`flex justify-between items-center ${showToggle ? 'cursor-pointer' : ''}`}
        onClick={showToggle ? onToggle : undefined}
      >
        <h2 className="text-xl font-bold text-gray-900">{styleName} Results</h2>
        {showToggle && (
          <button
            className="px-4 py-2 !bg-brand-500 text-white rounded-lg hover:!bg-brand-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        )}
      </div>
      
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!isExpanded}
      >
        <div className={`pt-4 ${centerContent ? 'mx-auto max-w-[640px]' : ''}`}>
          {styleName === 'Driver' && (
            <DriverGraph results={filteredResults} submissions={filteredSubmissions} />
          )}
          {styleName === 'Expressive' && (
            <ExpressiveGraph results={filteredResults} submissions={filteredSubmissions} />
          )}
          {styleName === 'Analyser' && (
            <AnalyserGraph results={filteredResults} submissions={filteredSubmissions} />
          )}
          {styleName === 'Amiable' && (
            <AmiableGraph results={filteredResults} submissions={filteredSubmissions} />
          )}
        </div>
        {/* Participants under this style */}
        <div className="pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            Participants ({filteredSubmissions.length})
          </h4>
          {filteredSubmissions.length === 0 ? (
            <div className="text-sm text-gray-500">No participants for this style yet</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSubmissions.map((submission, index) => (
                <div key={submission.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-gray-900">{submission.name}</div>
                  <div className="text-xs text-brand-600">{filteredResults[index]?.socialStyle}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialStyleSection;