export interface Submission {
  id: string;
  session_code: string;
  name: string;
  questions_answers: {
    [key: string]: string; // "q1": "a", "q2": "b", etc.
  };
  social_style: string[];
  created_at: Date;
}

export interface QuizResult {
  firstHalf: {
    a: number;
    b: number;
    difference: number;
    dominant: 'a' | 'b';
  };
  secondHalf: {
    c: number;
    d: number;
    difference: number;
    dominant: 'c' | 'd';
  };
  socialStyle: string;
  coordinates: {
    x: number; // -5 to 5 (A to B)
    y: number; // -5 to 5 (D to C)
  };
}

export interface SessionData {
  session_code: string;
  submissions: Submission[];
  results: QuizResult[];
  showResults?: boolean;
} 