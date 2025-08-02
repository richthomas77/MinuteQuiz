import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertResourceSchema, insertQuizSchema, insertUserProgressSchema, type Question } from "@shared/schema";
import multer from "multer";
import { z } from "zod";
import { generateBonusQuestions } from "./openai";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'));
    }
  }
});

// Simple quiz parsing function - in a real app, this would use proper document parsing libraries
function parseQuizDocument(buffer: Buffer, mimetype: string): Question[] {
  // This is a simplified parser - in production, you'd use libraries like:
  // - pdf-parse for PDFs
  // - mammoth for DOCX
  // - For now, we'll return sample questions for demonstration
  
  const sampleQuestions: Question[] = [
    {
      id: Math.random().toString(36).substr(2, 9),
      text: "Sample question parsed from uploaded document?",
      options: [
        { id: Math.random().toString(36).substr(2, 9), text: "Option A", letter: "A" },
        { id: Math.random().toString(36).substr(2, 9), text: "Option B", letter: "B" },
        { id: Math.random().toString(36).substr(2, 9), text: "Option C", letter: "C" },
        { id: Math.random().toString(36).substr(2, 9), text: "Option D", letter: "D" }
      ],
      correctAnswerId: "",
      explanation: "This is a sample explanation parsed from the document."
    }
  ];
  
  // Set correct answer (random for demo)
  sampleQuestions[0].correctAnswerId = sampleQuestions[0].options[0].id;
  
  return sampleQuestions;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Resource routes
  app.get('/api/resources', async (req, res) => {
    try {
      const resources = await storage.getResources();
      res.json(resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ message: 'Failed to fetch resources' });
    }
  });

  app.get('/api/resources/:id', async (req, res) => {
    try {
      const resource = await storage.getResource(req.params.id);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }
      res.json(resource);
    } catch (error) {
      console.error('Error fetching resource:', error);
      res.status(500).json({ message: 'Failed to fetch resource' });
    }
  });

  app.post('/api/resources', async (req, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Error creating resource:', error);
      res.status(500).json({ message: 'Failed to create resource' });
    }
  });

  // Quiz routes
  app.get('/api/resources/:resourceId/quizzes', async (req, res) => {
    try {
      const quizzes = await storage.getQuizzesByResource(req.params.resourceId);
      res.json(quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({ message: 'Failed to fetch quizzes' });
    }
  });

  app.get('/api/quizzes/:id', async (req, res) => {
    try {
      const quiz = await storage.getQuiz(req.params.id);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.json(quiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      res.status(500).json({ message: 'Failed to fetch quiz' });
    }
  });

  app.post('/api/resources/:resourceId/quizzes', upload.single('document'), async (req, res) => {
    try {
      const { title, description } = req.body;
      const resourceId = req.params.resourceId;
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Parse the uploaded document
      const questions = parseQuizDocument(req.file.buffer, req.file.mimetype);

      const quizData = {
        resourceId,
        title,
        description,
        questions
      };

      const validatedData = insertQuizSchema.parse(quizData);
      const quiz = await storage.createQuiz(validatedData);
      res.status(201).json(quiz);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Error creating quiz:', error);
      res.status(500).json({ message: 'Failed to create quiz' });
    }
  });

  // Progress routes
  app.get('/api/progress/:userId', async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ message: 'Failed to fetch progress' });
    }
  });

  app.get('/api/progress/:userId/resources/:resourceId', async (req, res) => {
    try {
      const progress = await storage.getUserProgressByResource(req.params.userId, req.params.resourceId);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching resource progress:', error);
      res.status(500).json({ message: 'Failed to fetch resource progress' });
    }
  });

  app.post('/api/progress', async (req, res) => {
    try {
      const validatedData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.saveUserProgress(validatedData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Error saving progress:', error);
      res.status(500).json({ message: 'Failed to save progress' });
    }
  });

  // Bonus questions route - generates AI-powered additional questions
  app.post('/api/quizzes/:quizId/bonus-questions', async (req, res) => {
    try {
      const quizId = req.params.quizId;
      if (!quizId) {
        return res.status(400).json({ message: 'Quiz ID is required' });
      }

      const quiz = await storage.getQuiz(quizId);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }

      const bonusQuestions = await generateBonusQuestions(
        quiz.title,
        quiz.description || '',
        quiz.questions
      );

      res.json({ questions: bonusQuestions });
    } catch (error) {
      console.error('Error generating bonus questions:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to generate bonus questions' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
