import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import type { QuizResult } from "../types/index";

interface Props {
  results: QuizResult[];
  submissions: Array<{ id: string; name: string }>;
}

const AnalyserGraph: React.FC<Props> = ({ results, submissions }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef<string>(
    `analyser-graph-${Math.random().toString(36).slice(2)}`
  );

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
        quadrantXAxisTextFill: "#212121",
        quadrantYAxisTextFill: "#212121",
        quadrantTitleFill: "#212121",
      },
    });
  }, []);

  useEffect(() => {
    if (!graphRef.current || results.length === 0) return;
    const normalize = (n: number) => Math.max(0, Math.min(1, (n + 5) / 10));
    let code = `quadrantChart
    title Analyser Results
    x-axis Asks more --> Tells more
    y-axis People focused --> Task focused
    quadrant-1 Driver
    quadrant-2 Analyser
    quadrant-3 Amiable
    quadrant-4 Expressive`;
    results.forEach((r, i) => {
      const s = submissions[i];
      const x = normalize(r.coordinates.x);
      const y = normalize(r.coordinates.y);
      const safe = (s?.name || `P_${i + 1}`).replace(/[^a-zA-Z0-9]/g, "_");
      const xf = x === 1 ? "1" : x.toFixed(2);
      const yf = y === 1 ? "1" : y.toFixed(2);
      code += `\n    ${safe}: [${xf}, ${yf}]`;
    });
    (async () => {
      try {
        if (graphRef.current) graphRef.current.innerHTML = "";
        const { svg } = await mermaid.render(renderIdRef.current, code);
        if (graphRef.current) graphRef.current.innerHTML = svg;
      } catch (e) {
        if (graphRef.current) {
          graphRef.current.innerHTML = `<div class=\"text-sm text-gray-500\">Unable to render Analyser chart</div>`;
        }
        // eslint-disable-next-line no-console
        console.error(e);
      }
    })();
  }, [results, submissions]);

  if (results.length === 0) return <div className="text-center p-8 text-gray-500">No Analyser results yet</div>;
  return <div ref={graphRef} className="w-full min-h-96" />;
};

export default AnalyserGraph;

