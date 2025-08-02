// Schema types for Vercel version
export interface Resource {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  totalQuizzes: number;
  createdAt: Date;
}

export interface Question {
  id: string;
  text: string;
  options: Array<{
    id: string;
    text: string;
    letter: string;
  }>;
  correctAnswerId: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  resourceId: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface UserProgress {
  id: string;
  userId: string;
  resourceId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  answers: Record<string, string>;
  completedAt: Date;
}