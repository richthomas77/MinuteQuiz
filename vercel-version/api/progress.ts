import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory storage for demo purposes
let progressData: any[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { userId, resourceId } = req.query;
    let progress = progressData;
    
    if (userId) {
      progress = progress.filter(p => p.userId === userId);
    }
    if (resourceId) {
      progress = progress.filter(p => p.resourceId === resourceId);
    }
    
    return res.json(progress);
  }
  
  if (req.method === 'POST') {
    const progressEntry = {
      id: Date.now().toString(),
      userId: req.body.userId || 'demo-user',
      ...req.body,
      completedAt: new Date(),
    };
    
    progressData.push(progressEntry);
    return res.json(progressEntry);
  }
  
  res.status(405).json({ message: 'Method not allowed' });
}