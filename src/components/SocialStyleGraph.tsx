import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import type { QuizResult } from "../types/index";

interface SocialStyleGraphProps {
  results: QuizResult[];
  submissions: Array<{ id: string; name: string }>;
  currentUserResult?: QuizResult;
  currentUserName?: string;
}

const SocialStyleGraph: React.FC<SocialStyleGraphProps> = ({
  results,
  submissions,
  currentUserResult,
  currentUserName,
}) => {
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      quadrantChart: {
        chartWidth: 600,
        chartHeight: 500,
        titleFontSize: 18,
        quadrantLabelFontSize: 14,
        pointLabelFontSize: 12,
        pointRadius: 8,
      },
      themeVariables: {
        quadrant1Fill: "#e3f2fd",
        quadrant2Fill: "#e8f5e8",
        quadrant3Fill: "#ffebee",
        quadrant4Fill: "#f3e5f5",
        quadrant1TextFill: "#1565c0",
        quadrant2TextFill: "#2e7d32",
        quadrant3TextFill: "#c62828",
        quadrant4TextFill: "#7b1fa2",
        quadrantPointFill: "#1976d2",
        quadrantPointTextFill: "#000000",
        quadrantXAxisTextFill: "#212121", // Changed from #424242 to black
        quadrantYAxisTextFill: "#212121", // Changed from #424242 to black
        quadrantTitleFill: "#212121",
      },
    });
  }, []);

  useEffect(() => {
    if (!graphRef.current || results.length === 0) return;

    const generateMermaidGraph = () => {
      // Convert coordinates from -5 to 5 range to 0 to 1 range for Mermaid
      const normalizeCoordinate = (coord: number) => {
        return Math.max(0, Math.min(1, (coord + 5) / 10));
      };

      let mermaidCode = `quadrantChart
    title Social Style Assessment Results
    x-axis Ask - B --> Tell - A
    y-axis People focused - C --> Task focused - D
    quadrant-1 Driver
    quadrant-2 Analyser
    quadrant-3 Amiable
    quadrant-4 Expressive`;

      // Add participant data points (simplified without styling)
      results.forEach((result, index) => {
        const submission = submissions[index];
        const x = normalizeCoordinate(result.coordinates.x);
        const y = normalizeCoordinate(result.coordinates.y);

        // Create a safe identifier that avoids Mermaid reserved words and special characters
        const safeId = (submission?.name || `Participant_${index + 1}`).replace(
          /[^a-zA-Z0-9]/g,
          "_"
        );

        // Format coordinates, converting 1.00 to 1
        const xFormatted = x === 1 ? "1" : x.toFixed(2);
        const yFormatted = y === 1 ? "1" : y.toFixed(2);

        // Add the point without quotes
        mermaidCode += `\n    ${safeId}: [${xFormatted}, ${yFormatted}]`;
      });

      return mermaidCode;
    };

    const renderGraph = async () => {
      let graphCode = "";
      try {
        graphCode = generateMermaidGraph();
        console.log("Mermaid code:", graphCode);

        const { svg } = await mermaid.render("social-style-graph", graphCode);
        if (graphRef.current) {
          graphRef.current.innerHTML = svg;
          graphRef.current.style.overflow = "visible"; // Allow overflow display of container

          // Also set overflow visible on the SVG element itself
          const svgElement = graphRef.current.querySelector("svg");
          if (svgElement) {
            svgElement.style.overflow = "visible";
          }
        }
      } catch (error) {
        console.error("Error rendering Mermaid graph:", error);
        console.error("Graph code that failed:", graphCode);
        // Fallback to simple text display
        renderFallback();
      }
    };

    const renderFallback = () => {
      if (graphRef.current) {
        graphRef.current.innerHTML = `
          <div class="text-center p-8">
            <h3 class="text-lg font-semibold mb-4">Social Style Results</h3>
            <div class="relative w-full h-80 bg-gray-50 rounded-lg border-2 border-gray-200 mb-6">
              <!-- Simple quadrant visualization -->
              <div class="absolute inset-0">
                <!-- Vertical line -->
                <div class="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300"></div>
                <!-- Horizontal line -->
                <div class="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
                
                <!-- Quadrant labels -->
                <div class="absolute top-2 left-2 text-xs font-medium text-white-600">Task focused</div>
                <div class="absolute top-2 right-2 text-xs font-medium text-white-600">Task focused</div>
                <div class="absolute bottom-2 left-2 text-xs font-medium !text-black-600">People focused</div>
                <div class="absolute bottom-2 right-2 text-xs font-medium !text-black-600">People focused</div>
                <div class="absolute top-1/2 left-2 text-xs font-medium text-gray-white transform -translate-y-1/2">Tell</div>
                <div class="absolute top-1/2 right-2 text-xs font-medium text-gray-white transform -translate-y-1/2">Ask</div>
                
                <!-- Quadrant names -->
                <div class="absolute top-4 left-4 text-sm font-semibold text-blue-600">Analyser</div>
                <div class="absolute top-4 right-4 text-sm font-semibold text-green-600">Driver</div>
                <div class="absolute bottom-4 left-4 text-sm font-semibold text-red-600">Amiable</div>
                <div class="absolute bottom-4 right-4 text-sm font-semibold text-purple-600">Expressive
                
                <!-- Data points -->
                ${results
                  .map((result, index) => {
                    const submission = submissions[index];
                    const isCurrentUser =
                      currentUserResult &&
                      result.coordinates.x ===
                        currentUserResult.coordinates.x &&
                      result.coordinates.y === currentUserResult.coordinates.y;
                    const x = ((result.coordinates.x + 5) / 10) * 100;
                    const y = ((result.coordinates.y + 5) / 10) * 100;

                    return `
                    <div
                      class="absolute w-4 h-4 ${
                        isCurrentUser
                          ? "bg-red-500 border-4 border-white"
                          : "bg-blue-500 border-2 border-white"
                      } rounded-full transform -translate-x-2 -translate-y-2 shadow-lg"
                      style="left: ${x}%; top: ${100 - y}%;"
                      title="${submission?.name || "Unknown"}: ${
                      result.socialStyle
                    }${isCurrentUser ? " (You)" : ""}"
                    ></div>
                  `;
                  })
                  .join("")}
              </div>
            </div>
            <div class="mt-6">
              <h4 class="font-medium mb-2">Participants:</h4>
              <div class="space-y-1">
                ${results
                  .map((result, index) => {
                    const submission = submissions[index];
                    const isCurrentUser =
                      currentUserResult &&
                      result.coordinates.x ===
                        currentUserResult.coordinates.x &&
                      result.coordinates.y === currentUserResult.coordinates.y;
                    return `
                    <div class="text-sm ${
                      isCurrentUser ? "font-bold text-red-600" : ""
                    }">
                      ${submission?.name || "Unknown"}: ${result.socialStyle}
                      ${isCurrentUser ? " (You)" : ""}
                    </div>
                  `;
                  })
                  .join("")}
              </div>
            </div>
          </div>
        `;
      }
    };

    renderGraph();
  }, [results, submissions, currentUserResult, currentUserName]);

  if (results.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
        <p className="text-sm">Share the session code to get started</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={graphRef}
        className="w-full min-h-96 flex items-center justify-center overflow-visible"
      />
    </div>
  );
};

export default SocialStyleGraph;
