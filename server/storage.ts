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
      coverImageUrl: "https://m.media-amazon.com/images/I/71QKQ9mwV7L._SY522_.jpg",
      totalQuizzes: 2,
      createdAt: new Date(),
    };
    this.resources.set(resourceId, defaultResource);

    // First quiz: Framing
    const framingQuizId = randomUUID();
    const framingQuestions: Question[] = [
      {
        id: randomUUID(),
        text: "What is 'framing' in the context of the first minute of interaction?",
        options: [
          { id: randomUUID(), text: "Setting physical boundaries in a room", letter: "A" },
          { id: randomUUID(), text: "Creating the context and expectation for how the interaction will unfold", letter: "B" },
          { id: randomUUID(), text: "Taking a photograph to remember the moment", letter: "C" },
          { id: randomUUID(), text: "Choosing the right words to start a conversation", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Framing is about establishing the context and setting expectations for how the interaction will proceed, helping others understand what to expect."
      },
      {
        id: randomUUID(),
        text: "Which of the following is an example of effective framing at the start of a meeting?",
        options: [
          { id: randomUUID(), text: "Jumping straight into the agenda without introduction", letter: "A" },
          { id: randomUUID(), text: "Clearly stating the purpose, expected outcomes, and time commitment", letter: "B" },
          { id: randomUUID(), text: "Asking everyone to introduce themselves for 10 minutes", letter: "C" },
          { id: randomUUID(), text: "Starting with a long personal story", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Effective framing involves clearly communicating the purpose, what you hope to achieve, and the time investment required, so everyone knows what to expect."
      },
      {
        id: randomUUID(),
        text: "Why is framing particularly important in the first minute?",
        options: [
          { id: randomUUID(), text: "It helps you appear more professional", letter: "A" },
          { id: randomUUID(), text: "It reduces anxiety and uncertainty for everyone involved", letter: "B" },
          { id: randomUUID(), text: "It makes you sound more intelligent", letter: "C" },
          { id: randomUUID(), text: "It saves time later in the conversation", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Framing in the first minute reduces anxiety and uncertainty by helping everyone understand what's happening and what's expected, creating psychological safety."
      }
    ];

    // Set correct answer IDs for framing quiz
    framingQuestions[0].correctAnswerId = framingQuestions[0].options[1].id;
    framingQuestions[1].correctAnswerId = framingQuestions[1].options[1].id;
    framingQuestions[2].correctAnswerId = framingQuestions[2].options[1].id;

    const framingQuiz: Quiz = {
      id: framingQuizId,
      resourceId: resourceId,
      title: "Framing: Setting the Stage",
      description: "Master the art of framing interactions to create clarity and reduce anxiety",
      questions: framingQuestions,
      createdAt: new Date(),
    };
    this.quizzes.set(framingQuizId, framingQuiz);

    // Second quiz: GPS Method
    const gpsQuizId = randomUUID();
    const gpsQuestions: Question[] = [
      {
        id: randomUUID(),
        text: "What does GPS stand for in the context of first-minute interactions?",
        options: [
          { id: randomUUID(), text: "Goals, Process, Success", letter: "A" },
          { id: randomUUID(), text: "Greet, Present, Summarize", letter: "B" },
          { id: randomUUID(), text: "Goal, Path, Success metrics", letter: "C" },
          { id: randomUUID(), text: "Global Positioning System", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "GPS stands for Goal, Path, and Success metrics - a framework for clearly communicating what you want to achieve, how you'll get there, and how you'll know you've succeeded."
      },
      {
        id: randomUUID(),
        text: "In the GPS method, what should you communicate about the 'Goal'?",
        options: [
          { id: randomUUID(), text: "Your personal career objectives", letter: "A" },
          { id: randomUUID(), text: "What you want to accomplish in this specific interaction", letter: "B" },
          { id: randomUUID(), text: "Long-term business strategy", letter: "C" },
          { id: randomUUID(), text: "Your schedule for the day", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "The Goal component focuses specifically on what you want to accomplish in this particular interaction or meeting."
      },
      {
        id: randomUUID(),
        text: "What does the 'Path' element of GPS help communicate?",
        options: [
          { id: randomUUID(), text: "The physical route to your destination", letter: "A" },
          { id: randomUUID(), text: "Your career progression plan", letter: "B" },
          { id: randomUUID(), text: "The process or approach you'll use to achieve the goal", letter: "C" },
          { id: randomUUID(), text: "The agenda for the entire week", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "The Path explains the process, approach, or methodology you'll use to achieve the stated goal, giving others clarity on how the interaction will unfold."
      },
      {
        id: randomUUID(),
        text: "Why are 'Success metrics' important in the GPS method?",
        options: [
          { id: randomUUID(), text: "They help you track financial performance", letter: "A" },
          { id: randomUUID(), text: "They provide clear criteria for knowing when the goal has been achieved", letter: "B" },
          { id: randomUUID(), text: "They impress others with your analytical skills", letter: "C" },
          { id: randomUUID(), text: "They help you plan future meetings", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Success metrics provide clear, measurable criteria so everyone knows exactly what constitutes successful completion of the interaction or meeting."
      }
    ];

    // Set correct answer IDs for GPS quiz
    gpsQuestions[0].correctAnswerId = gpsQuestions[0].options[2].id;
    gpsQuestions[1].correctAnswerId = gpsQuestions[1].options[1].id;
    gpsQuestions[2].correctAnswerId = gpsQuestions[2].options[2].id;
    gpsQuestions[3].correctAnswerId = gpsQuestions[3].options[1].id;

    const gpsQuiz: Quiz = {
      id: gpsQuizId,
      resourceId: resourceId,
      title: "GPS Method: Goal, Path, Success",
      description: "Learn to use the GPS framework for clear communication and successful outcomes",
      questions: gpsQuestions,
      createdAt: new Date(),
    };
    this.quizzes.set(gpsQuizId, gpsQuiz);
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
      totalQuizzes: insertResource.totalQuizzes ?? 0,
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
      resource.totalQuizzes = (resource.totalQuizzes ?? 0) + 1;
      this.resources.set(resource.id, resource);
    }
    
    return quiz;
  }

  async deleteQuiz(id: string): Promise<boolean> {
    const quiz = this.quizzes.get(id);
    if (quiz) {
      // Update resource quiz count
      const resource = this.resources.get(quiz.resourceId);
      if (resource && (resource.totalQuizzes ?? 0) > 0) {
        resource.totalQuizzes = (resource.totalQuizzes ?? 0) - 1;
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
