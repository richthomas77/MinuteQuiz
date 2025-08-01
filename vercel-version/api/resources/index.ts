import { VercelRequest, VercelResponse } from '@vercel/node';
import { mockQuizData } from '../_data/mockData';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.json(mockQuizData.resources);
  }
  
  res.status(405).json({ message: 'Method not allowed' });
}