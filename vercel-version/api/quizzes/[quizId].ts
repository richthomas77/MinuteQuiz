import { VercelRequest, VercelResponse } from '@vercel/node';
import { mockQuizData } from '../_data/mockData';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { quizId } = req.query;
  
  if (req.method === 'GET') {
    const quiz = mockQuizData.quizzes.find(q => q.id === quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    return res.json(quiz);
  }
  
  res.status(405).json({ message: 'Method not allowed' });
}