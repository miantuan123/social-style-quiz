import type { QuizResult } from "../types/index";
import { socialStyles } from "../constants/questions";

export const QUIZ_PROMPT =
  "Select the option that best describes your typical behaviour or preference:";

export function calculateQuizResult(answers: {
  [key: string]: string;
}): QuizResult {
  // Calculate first half (questions 1-10, A vs B)
  let aCount = 0;
  let bCount = 0;
  let cCount = 0;
  let dCount = 0;

  for (let i = 1; i <= 20; i++) {
    const answer = answers[`q${i}`];
    if (answer === "a") aCount++;
    if (answer === "b") bCount++;
    if (answer === "c") cCount++;
    if (answer === "d") dCount++;
  }
  
  const firstHalfDifference = Math.abs(aCount - bCount);
  const firstHalfDominant = aCount >= bCount ? "a" : "b";
  const secondHalfDifference = Math.abs(cCount - dCount);
  const secondHalfDominant = cCount >= dCount ? "c" : "d";

  // Determine social style
  const socialStyleKey =
    `${firstHalfDominant.toUpperCase()}${secondHalfDominant.toUpperCase()}` as keyof typeof socialStyles;
  const socialStyle = socialStyles[socialStyleKey];

  // Calculate coordinates for the graph
  // X-axis: A (left) to B (right), range -5 to 5
  // Y-axis: D (bottom) to C (top), range -5 to 5
  const x =
    firstHalfDominant === "a" ? -firstHalfDifference : firstHalfDifference;
  const y =
    secondHalfDominant === "c" ? -secondHalfDifference : secondHalfDifference;

  return {
    firstHalf: {
      a: aCount,
      b: bCount,
      difference: firstHalfDifference,
      dominant: firstHalfDominant,
    },
    secondHalf: {
      c: cCount,
      d: dCount,
      difference: secondHalfDifference,
      dominant: secondHalfDominant,
    },
    socialStyle,
    coordinates: { x, y },
  };
}

export function generateSessionCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function getQuadrantLabel(x: number, y: number): string {
  if (x >= 0 && y >= 0) return "BC"; // Amiable
  if (x < 0 && y >= 0) return "AC"; // Expressive
  if (x >= 0 && y < 0) return "BD"; // Analyser
  if (x < 0 && y < 0) return "AD"; // Driver
  return "Unknown";
}
