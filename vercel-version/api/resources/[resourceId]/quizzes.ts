import { VercelRequest, VercelResponse } from '@vercel/node';
import { mockQuizData } from '../../_data/mockData';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { resourceId } = req.query;
  
  if (req.method === 'GET') {
    const quizzes = mockQuizData.quizzes.filter(quiz => quiz.resourceId === resourceId);
    return res.json(quizzes);
  }
  
  res.status(405).json({ message: 'Method not allowed' });
}