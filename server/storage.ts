import { type Resource, type InsertResource, type Quiz, type InsertQuiz, type UserProgress, type InsertUserProgress, type Question } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Resource operations
  getResources(): Promise<Resource[]>;
  getResource(id: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: string): Promise<boolean>;

  // Quiz operations
  getQuizzesByResource(resourceId: string): Promise<Quiz[]>;
  getQuiz(id: string): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  deleteQuiz(id: string): Promise<boolean>;

  // User progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressByResource(userId: string, resourceId: string): Promise<UserProgress[]>;
  saveUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
}

export class MemStorage implements IStorage {
  private resources: Map<string, Resource>;
  private quizzes: Map<string, Quiz>;
  private userProgress: Map<string, UserProgress>;

  constructor() {
    this.resources = new Map();
    this.quizzes = new Map();
    this.userProgress = new Map();
    
    // Initialize with "The First Minute" resource
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    const resourceId = randomUUID();
    const defaultResource: Resource = {
      id: resourceId,
      title: "The First Minute",
      description: "Master the critical first moments of any interaction or presentation",
      coverImageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3",
      totalQuizzes: 1,
      createdAt: new Date(),
    };
    this.resources.set(resourceId, defaultResource);

    // Sample quiz for "The First Minute"
    const quizId = randomUUID();
    const sampleQuestions: Question[] = [
      {
        id: randomUUID(),
        text: "According to the author, what is the most critical element in making a strong first impression during the first minute of any interaction?",
        options: [
          { id: randomUUID(), text: "Your body language and posture", letter: "A" },
          { id: randomUUID(), text: "The words you choose to speak first", letter: "B" },
          { id: randomUUID(), text: "Your genuine attention and presence", letter: "C" },
          { id: randomUUID(), text: "Your professional appearance and attire", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Excellent choice. The author emphasizes that genuine attention and presence create the foundation for meaningful connections, more than any specific technique or appearance."
      },
      {
        id: randomUUID(),
        text: "What does the book suggest is the primary barrier to making effective first impressions?",
        options: [
          { id: randomUUID(), text: "Lack of confidence", letter: "A" },
          { id: randomUUID(), text: "Being too focused on yourself rather than the other person", letter: "B" },
          { id: randomUUID(), text: "Not having enough time to prepare", letter: "C" },
          { id: randomUUID(), text: "Speaking too quickly", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "The book emphasizes that when we're too focused on how we appear or what we'll say next, we miss the opportunity to truly connect with the other person."
      }
    ];

    // Set correct answer IDs
    sampleQuestions[0].correctAnswerId = sampleQuestions[0].options[2].id; // "Your genuine attention and presence"
    sampleQuestions[1].correctAnswerId = sampleQuestions[1].options[1].id; // "Being too focused on yourself"

    const defaultQuiz: Quiz = {
      id: quizId,
      resourceId: resourceId,
      title: "Chapter 1: Making First Impressions",
      description: "Test your understanding of the key concepts from the first chapter",
      questions: sampleQuestions,
      createdAt: new Date(),
    };
    this.quizzes.set(quizId, defaultQuiz);
  }

  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResource(id: string): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = randomUUID();
    const resource: Resource = {
      ...insertResource,
      id,
      createdAt: new Date(),
    };
    this.resources.set(id, resource);
    return resource;
  }

  async updateResource(id: string, update: Partial<InsertResource>): Promise<Resource | undefined> {
    const resource = this.resources.get(id);
    if (!resource) return undefined;
    
    const updated = { ...resource, ...update };
    this.resources.set(id, updated);
    return updated;
  }

  async deleteResource(id: string): Promise<boolean> {
    return this.resources.delete(id);
  }

  async getQuizzesByResource(resourceId: string): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(quiz => quiz.resourceId === resourceId);
  }

  async getQuiz(id: string): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = randomUUID();
    const quiz: Quiz = {
      ...insertQuiz,
      id,
      createdAt: new Date(),
    };
    this.quizzes.set(id, quiz);
    
    // Update resource quiz count
    const resource = this.resources.get(insertQuiz.resourceId);
    if (resource) {
      resource.totalQuizzes = (resource.totalQuizzes || 0) + 1;
      this.resources.set(resource.id, resource);
    }
    
    return quiz;
  }

  async deleteQuiz(id: string): Promise<boolean> {
    const quiz = this.quizzes.get(id);
    if (quiz) {
      // Update resource quiz count
      const resource = this.resources.get(quiz.resourceId);
      if (resource && resource.totalQuizzes > 0) {
        resource.totalQuizzes = resource.totalQuizzes - 1;
        this.resources.set(resource.id, resource);
      }
    }
    return this.quizzes.delete(id);
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getUserProgressByResource(userId: string, resourceId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      progress => progress.userId === userId && progress.resourceId === resourceId
    );
  }

  async saveUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = {
      ...insertProgress,
      id,
      completedAt: new Date(),
    };
    this.userProgress.set(id, progress);
    return progress;
  }
}

export const storage = new MemStorage();
