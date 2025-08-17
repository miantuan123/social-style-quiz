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
      a: "Emphasize ideas by change of voice tone",
      b: "Little use of voice tone to emphasize ideas",
    },
  },
  {
    question: "In meetings, I typically:",
    options: {
      b: "Expressions and posture quiet and subdued",
      a: "Expressions dominant and assertive",
    },
  },
  {
    question: "In disagreements, I:",
    options: {
      d: "Personal interactions are not a main concern",
      c: "Sensitive about personal interactions",
    },
  },
  {
    question: "When making decisions, I:",
    options: {
      a: "Voice projection loud and clear",
      b: "Voice typically soft and calm",
    },
  },
  {
    question: "When someone disagrees with me, I:",
    options: {
      a: "Quick, clear, fast-paced speech",
      b: "Deliberate, studied speech",
    },
  },
  {
    question: "In team discussions, I:",
    options: {
      c: "When working on projects, concerned about the impact on others",
      d: "When working on projects, focused mostly on achieving the set objectives",
    },
  },
  {
    question: "In social situations, I:",
    options: {
      b: "Soft handshake",
      a: "Firm handshake",
    },
  },
  {
    question: "When giving feedback, I:",
    options: {
      a: "Make statement more often than ask questions",
      b: "Ask questions more often than make statements",
    },
  },
  {
    question: "In group projects, I:",
    options: {
      a: "Find it easy to meet new people",
      b: "Not comfortable around new people",
    },
  },
  {
    question: "When someone is struggling, I:",
    options: {
      a: "Tend to lean forward to make a point",
      b: "Tend to lean back while in discussion",
    },
  },
  {
    question: "When presenting ideas, I:",
    options: {
      b: "Vague about needs and wants",
      a: "Directly express needs and wants",
    },
  },
  {
    question: "When solving problems, I:",
    options: {
      a: "Enjoy fast-paced, dynamic environment",
      b: "Enjoy steady, calm environment",
    },
  },
  // Next 10 questions (C vs D - people vs task)
  {
    question: "When I'm excited about something, I:",
    options: {
      d: "Limited facial expressions",
      c: "Animated facial expressions",
    },
  },
  {
    question: "In stressful situations, I:",
    options: {
      c: "Actions open and eager",
      d: "Actions cautious or careful",
    },
  },
  {
    question: "When celebrating success, I:",
    options: {
      c: "Little effort to push for facts",
      d: "Ask for facts and details",
    },
  },
  {
    question: "When I'm frustrated, I:",
    options: {
      d: "Infrequent eye contact",
      c: "Frequent eye contact",
    },
  },
  {
    question: "When receiving praise, I:",
    options: {
      c: "Open, friendly gestures",
      d: "Limited use of gestures: hands clenched, arms folded or on the desk, etc.",
    },
  },
  {
    question: "When someone shares good news, I:",
    options: {
      c: "Flexible to changes to accommodate others",
      d: "Prefer to stick to plan",
    },
  },
  {
    question: "When I'm nervous about something, I:",
    options: {
      c: "Shares personal life, stories, feelings",
      d: "Limited reference to personal feelings, storytelling, or small talk Reserved",
    },
  },
  {
    question: "When working on creative projects, I:",
    options: {
      c: "Open, responsive",
      d: "Reserved",
    },
  },
];

export const socialStyles = {
  AC: "Expressive",
  BC: "Amiable",
  AD: "Driver",
  BD: "Analyser",
} as const;

export type SocialStyle = keyof typeof socialStyles;
