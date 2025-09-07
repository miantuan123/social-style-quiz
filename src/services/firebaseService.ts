import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Submission, SessionData } from "../types/index";
import { calculateQuizResult } from "../utils/quizUtils";

export async function createSubmission(
  sessionCode: string,
  name: string,
  answers: { [key: string]: string }
): Promise<string> {
  const result = calculateQuizResult(answers);

  const submission: Omit<Submission, "id"> = {
    session_code: sessionCode,
    name,
    questions_answers: answers,
    social_style: [result.socialStyle],
    created_at: new Date(),
  };

  const docRef = await addDoc(collection(db, "submissions"), submission);
  return docRef.id;
}

export async function getSubmissionById(
  submissionId: string
): Promise<Submission | null> {
  const docRef = doc(db, "submissions", submissionId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      session_code: data.session_code,
      name: data.name,
      questions_answers: data.questions_answers,
      social_style: data.social_style,
      created_at: data.created_at?.toDate() || new Date(),
    };
  }
  return null;
}

export function subscribeToSession(
  sessionCode: string,
  callback: (data: SessionData) => void
) {
  const q = query(
    collection(db, "submissions"),
    where("session_code", "==", sessionCode)
  );

  const unsubSubmissions = onSnapshot(
    q,
    async (snapshot) => {
      console.log(
        `Session ${sessionCode}: Received ${snapshot.size} documents`
      );

      const submissions: Submission[] = [];

      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        submissions.push({
          id: docSnapshot.id,
          session_code: data.session_code,
          name: data.name,
          questions_answers: data.questions_answers,
          social_style: data.social_style,
          created_at: data.created_at?.toDate() || new Date(),
        });
      });

      // Sort submissions by created_at in descending order (newest first)
      submissions.sort(
        (a, b) => b.created_at.getTime() - a.created_at.getTime()
      );

      const results = submissions.map((sub) =>
        calculateQuizResult(sub.questions_answers)
      );

      // read showResults from sessions doc
      const sessionRef = doc(db, "sessions", sessionCode);
      const sessionSnap = await getDoc(sessionRef);
      const showResults = sessionSnap.exists() ? Boolean((sessionSnap.data() as any).showResults) : false;
      const showDriver = sessionSnap.exists() ? Boolean((sessionSnap.data() as any).showDriver) : false;
      const showExpressive = sessionSnap.exists() ? Boolean((sessionSnap.data() as any).showExpressive) : false;
      const showAnalyser = sessionSnap.exists() ? Boolean((sessionSnap.data() as any).showAnalyser) : false;
      const showAmiable = sessionSnap.exists() ? Boolean((sessionSnap.data() as any).showAmiable) : false;

      const sessionData: SessionData = {
        session_code: sessionCode,
        submissions,
        results,
        showResults,
        showDriver,
        showExpressive,
        showAnalyser,
        showAmiable,
      };

      console.log(
        `Session ${sessionCode}: Processed ${submissions.length} submissions`
      );
      callback(sessionData);
    },
    (error) => {
      console.error("Error listening to session:", error);
    }
  );

  // Also listen to the session doc for showResults changes
  const sessionDocRef = doc(db, "sessions", sessionCode);
  const unsubSession = onSnapshot(sessionDocRef, (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    // Fire a lightweight callback to update showResults only
    callback({
      session_code: sessionCode,
      submissions: [],
      results: [],
      showResults: Boolean((data as any).showResults),
      showDriver: Boolean((data as any).showDriver),
      showExpressive: Boolean((data as any).showExpressive),
      showAnalyser: Boolean((data as any).showAnalyser),
      showAmiable: Boolean((data as any).showAmiable),
    });
  });

  return () => {
    unsubSubmissions();
    unsubSession();
  };
}

export async function createSession(sessionCode: string): Promise<void> {
  const sessionRef = doc(db, "sessions", sessionCode);
  await setDoc(sessionRef, {
    session_code: sessionCode,
    showResults: false,
    showDriver: false,
    showExpressive: false,
    showAnalyser: false,
    showAmiable: false,
  });
}

export async function setSessionShowResults(
  sessionCode: string,
  show: boolean,
): Promise<void> {
  const sessionRef = doc(db, "sessions", sessionCode);
  await updateDoc(sessionRef, { showResults: show });
}

export async function getSessionShowResults(
  sessionCode: string
): Promise<boolean> {
  const sessionRef = doc(db, "sessions", sessionCode);
  const snap = await getDoc(sessionRef);
  return Boolean(snap.exists() && (snap.data() as any).showResults);
}

export async function setSessionShowStyle(
  sessionCode: string,
  style: 'Driver' | 'Expressive' | 'Analyser' | 'Amiable',
  show: boolean
): Promise<void> {
  const fieldMap: Record<string, string> = {
    Driver: 'showDriver',
    Expressive: 'showExpressive',
    Analyser: 'showAnalyser',
    Amiable: 'showAmiable',
  };
  const sessionRef = doc(db, "sessions", sessionCode);
  await updateDoc(sessionRef, { [fieldMap[style]]: show } as any);
}

// export async function getSession(sessionCode: string): Promise<Session | null> {
//   const sessionRef = doc(db, 'sessions', sessionCode);
//   const docSnap = await getDoc(sessionRef);

//   if (docSnap.exists()) {
//     const data = docSnap.data();
//     return {
//       code: data.code,
//       created_at: data.created_at?.toDate() || new Date(),
//       status: data.status || 'active'
//     };
//   }
//   return null;
// }

export const checkSessionExists = async (
  sessionCode: string
): Promise<boolean> => {
  const sessionRef = doc(db, "sessions", sessionCode);
  const docSnap = await getDoc(sessionRef);
  return docSnap.exists();
};
