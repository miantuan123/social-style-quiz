import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Submission, SessionData } from '../types';
import { calculateQuizResult } from '../utils/quizUtils';

export async function createSubmission(
  sessionCode: string, 
  name: string, 
  answers: { [key: string]: string }
): Promise<string> {
  const result = calculateQuizResult(answers);
  
  const submission: Omit<Submission, 'id'> = {
    session_code: sessionCode,
    name,
    questions_answers: answers,
    social_style: [result.socialStyle],
    created_at: new Date()
  };
  
  const docRef = await addDoc(collection(db, 'submissions'), submission);
  return docRef.id;
}

export async function getSubmissionById(submissionId: string): Promise<Submission | null> {
  const docRef = doc(db, 'submissions', submissionId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      session_code: data.session_code,
      name: data.name,
      questions_answers: data.questions_answers,
      social_style: data.social_style,
      created_at: data.created_at?.toDate() || new Date()
    };
  }
  return null;
}

export function subscribeToSession(
  sessionCode: string, 
  callback: (data: SessionData) => void
) {
  const q = query(
    collection(db, 'submissions'),
    where('session_code', '==', sessionCode),
    orderBy('created_at', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const submissions: Submission[] = [];
    
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      submissions.push({
        id: docSnapshot.id,
        session_code: data.session_code,
        name: data.name,
        questions_answers: data.questions_answers,
        social_style: data.social_style,
        created_at: data.created_at?.toDate() || new Date()
      });
    });
    
    const results = submissions.map(sub => calculateQuizResult(sub.questions_answers));
    
    const sessionData: SessionData = {
      session_code: sessionCode,
      submissions,
      results
    };
    
    callback(sessionData);
  }, (error) => {
    console.error('Error listening to session:', error);
  });
} 