export type Question = {
  question: string;
  options: {
    a?: string;
    b?: string;
    c?: string;
    d?: string;
  };
};

export const questions: Question[] = [
  // First 10 questions (A vs B - Tell vs Ask)
  {
    question: "When working in a team, I prefer to:",
    options: {
      a: "Take charge and direct others",
      b: "Ask for input and collaborate"
    }
  },
  {
    question: "In meetings, I typically:",
    options: {
      a: "Share my ideas and opinions openly",
      b: "Listen to others before speaking"
    }
  },
  {
    question: "When making decisions, I:",
    options: {
      a: "Trust my instincts and act quickly",
      b: "Gather more information first"
    }
  },
  {
    question: "When someone disagrees with me, I:",
    options: {
      a: "Stand my ground and defend my position",
      b: "Try to understand their perspective"
    }
  },
  {
    question: "In social situations, I:",
    options: {
      a: "Take the lead in conversations",
      b: "Let others guide the discussion"
    }
  },
  {
    question: "When solving problems, I:",
    options: {
      a: "Propose solutions immediately",
      b: "Ask questions to understand the problem better"
    }
  },
  {
    question: "When giving feedback, I:",
    options: {
      a: "Be direct and straightforward",
      b: "Ask how they would like to receive feedback"
    }
  },
  {
    question: "In group projects, I:",
    options: {
      a: "Take on leadership roles",
      b: "Support others in their roles"
    }
  },
  {
    question: "When someone is struggling, I:",
    options: {
      a: "Tell them what to do",
      b: "Ask how I can help"
    }
  },
  {
    question: "When presenting ideas, I:",
    options: {
      a: "Confidently state my position",
      b: "Present options and ask for input"
    }
  },
  // Next 10 questions (C vs D - Emotes vs Controls)
  {
    question: "When I'm excited about something, I:",
    options: {
      c: "Show my enthusiasm openly",
      d: "Keep my emotions in check"
    }
  },
  {
    question: "In stressful situations, I:",
    options: {
      c: "Express my feelings to others",
      d: "Focus on finding solutions"
    }
  },
  {
    question: "When celebrating success, I:",
    options: {
      c: "Share the joy with everyone",
      d: "Acknowledge it quietly"
    }
  },
  {
    question: "When I'm frustrated, I:",
    options: {
      c: "Let others know how I feel",
      d: "Work through it privately"
    }
  },
  {
    question: "In team discussions, I:",
    options: {
      c: "Show my reactions through facial expressions",
      d: "Maintain a neutral expression"
    }
  },
  {
    question: "When receiving praise, I:",
    options: {
      c: "Show my appreciation visibly",
      d: "Accept it modestly"
    }
  },
  {
    question: "When someone shares good news, I:",
    options: {
      c: "Get excited and celebrate with them",
      d: "Congratulate them calmly"
    }
  },
  {
    question: "In disagreements, I:",
    options: {
      c: "Show my emotions through body language",
      d: "Keep my composure"
    }
  },
  {
    question: "When I'm nervous about something, I:",
    options: {
      c: "Share my concerns with others",
      d: "Handle it internally"
    }
  },
  {
    question: "When working on creative projects, I:",
    options: {
      c: "Show my passion and excitement",
      d: "Focus on the technical aspects"
    }
  }
];

export const socialStyles = {
  'AC': 'Expressive',
  'BC': 'Facilitator', 
  'AD': 'Driver',
  'BD': 'Analyser'
} as const;

export type SocialStyle = keyof typeof socialStyles; 