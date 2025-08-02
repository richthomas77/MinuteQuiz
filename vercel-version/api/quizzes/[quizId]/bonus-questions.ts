import { VercelRequest, VercelResponse } from '@vercel/node';
import { mockQuizData } from '../../_data/mockData';
import { generateBonusQuestions } from '../../_lib/openai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { quizId } = req.query;
    
    if (!quizId || typeof quizId !== 'string') {
      return res.status(400).json({ message: 'Quiz ID is required' });
    }

    const quiz = mockQuizData.quizzes.find(q => q.id === quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const bonusQuestions = await generateBonusQuestions(
      quiz.title,
      quiz.description
    );

    res.json({ questions: bonusQuestions });
  } catch (error) {
    console.error('Error generating bonus questions:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to generate bonus questions' 
    });
  }
}