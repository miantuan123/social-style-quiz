import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
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

  return onSnapshot(
    q,
    (snapshot) => {
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

      const sessionData: SessionData = {
        session_code: sessionCode,
        submissions,
        results,
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
}

export async function createSession(sessionCode: string): Promise<void> {
  const sessionRef = doc(db, "sessions", sessionCode);
  await setDoc(sessionRef, {
    session_code: sessionCode
  });
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
