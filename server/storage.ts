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
      coverImageUrl: "/src/assets/TFM_1754083535157.png",
      totalQuizzes: 2,
      createdAt: new Date(),
    };
    this.resources.set(resourceId, defaultResource);

    // First quiz: Framing - Based on authentic study guide content
    const framingQuizId = randomUUID();
    const framingQuestions: Question[] = [
      {
        id: randomUUID(),
        text: "Project Update: 'Hey, about that new project... I was looking at the data, and it's pretty complex. Lots of moving parts, and we got some feedback from marketing yesterday. Anyway, it's definitely something we need to think about.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "Can we talk about the new project? It's complex, and I need you to think about it.", letter: "A" },
          { id: randomUUID(), text: "Hi, regarding the 'Phoenix' project, I need to update you because we've identified a major risk.", letter: "B" },
          { id: randomUUID(), text: "I heard some things about the project that are complex and involve marketing feedback.", letter: "C" },
          { id: randomUUID(), text: "Let's discuss project data and marketing feedback; it's important.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option clearly states the context ('Phoenix project'), a specific intent ('need to update you'), and the crucial key message ('identified a major risk'). Options A and D are too vague, and C provides context but no clear intent or point."
      },
      {
        id: randomUUID(),
        text: "Request for a Meeting: 'Can we chat? I have a few things I want to go over.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "Do you have a few minutes? I'd like to update you on the budget and get your input on staffing.", letter: "A" },
          { id: randomUUID(), text: "I need to talk to you about some things. When are you free?", letter: "B" },
          { id: randomUUID(), text: "I have several topics that need to be discussed, requiring about 10 minutes of your time.", letter: "C" },
          { id: randomUUID(), text: "Can we chat about everything on my mind today?", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option provides a clear intent by stating the purpose and scope of the conversation ('update you on the budget and get your input on staffing'), and sets a time expectation ('a few minutes') which is also a form of framing the interaction."
      },
      {
        id: randomUUID(),
        text: "Hiring Issue: 'So, the new hire for the sales team? We're having some trouble getting them onboarded. HR is saying something about paperwork.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "Regarding the new sales hire, I need your advice because there's an issue with their onboarding paperwork.", letter: "A" },
          { id: randomUUID(), text: "The sales team onboarding has paperwork issues that HR mentioned.", letter: "B" },
          { id: randomUUID(), text: "There's a problem with a new hire; I need to talk to you about it.", letter: "C" },
          { id: randomUUID(), text: "The new sales hire can't start because of HR.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option establishes the context ('new sales hire'), the intent ('need your advice'), and the key message ('issue with their onboarding paperwork') concisely. The other options are either too vague or lack a clear request for action/advice."
      },
      {
        id: randomUUID(),
        text: "Budget Concern: 'About the budget for next quarter... it's looking a bit tight. I've been reviewing the numbers, and there are some unexpected expenses.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "The budget is tight. I need help reviewing expenses.", letter: "A" },
          { id: randomUUID(), text: "Regarding the Q3 budget, I need your approval for additional funds as we're currently over budget.", letter: "B" },
          { id: randomUUID(), text: "We need to discuss financial numbers and unexpected costs for the next quarter.", letter: "C" },
          { id: randomUUID(), text: "The budget for next quarter looks bad, so I'm bringing it to your attention.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option provides clear context ('Q3 budget'), definite intent ('need your approval'), and a direct key message ('currently over budget,' implying a need for additional funds). Other options are too general or don't specify the intent or what is needed."
      },
      {
        id: randomUUID(),
        text: "New Policy Announcement: 'There's a new policy coming out. You'll need to read it. It's pretty long.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "I'm letting you know about the new 'Remote Work' policy; it requires everyone to be in the office three days a week.", letter: "A" },
          { id: randomUUID(), text: "The new policy is long, and you have to read it.", letter: "B" },
          { id: randomUUID(), text: "There's a new policy that needs your attention, and it's quite detailed.", letter: "C" },
          { id: randomUUID(), text: "I need you to review a new document that's been released.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option immediately identifies the context ('new Remote Work policy'), the intent ('letting you know about'), and the direct key message ('requires everyone to be in the office three days a week'). The other options lack specific context or key message details."
      }
    ];

    // Set correct answer IDs for framing quiz (based on answer key: B, A, A, B, A)
    framingQuestions[0].correctAnswerId = framingQuestions[0].options[1].id; // B
    framingQuestions[1].correctAnswerId = framingQuestions[1].options[0].id; // A  
    framingQuestions[2].correctAnswerId = framingQuestions[2].options[0].id; // A
    framingQuestions[3].correctAnswerId = framingQuestions[3].options[1].id; // B
    framingQuestions[4].correctAnswerId = framingQuestions[4].options[0].id; // A

    const framingQuiz: Quiz = {
      id: framingQuizId,
      resourceId: resourceId,
      title: "Framing: Setting the Stage",
      description: "Master the art of framing interactions to create clarity and reduce anxiety",
      questions: framingQuestions,
      createdAt: new Date(),
    };
    this.quizzes.set(framingQuizId, framingQuiz);

    // Second quiz: GPS Method - Based on authentic study guide content
    const gpsQuizId = randomUUID();
    const gpsQuestions: Question[] = [
      {
        id: randomUUID(),
        text: "Project Budget Overrun: You need to inform your manager that your project is over budget. You've already spent a lot of time analyzing where the money went, but you're not sure how to prevent it from happening again. Which GPS structured summary is best?",
        options: [
          { id: randomUUID(), text: "Goal: We need to get the project back on track financially. Problem: Last quarter's spending spiraled out of control due to unexpected material costs and contractor fees, which I have detailed in my report. Solution: I have compiled a detailed report of all expenses for your review.", letter: "A" },
          { id: randomUUID(), text: "Goal: Maintain the project within its allocated budget. Problem: We have exceeded our budget by 15% this quarter. Solution: I need your guidance on how to reallocate funds or if additional budget can be approved.", letter: "B" },
          { id: randomUUID(), text: "Goal: Avoid future budget overruns. Problem: We need to understand why the budget was exceeded. Solution: Let's review the historical spending data to pinpoint the exact causes.", letter: "C" },
          { id: randomUUID(), text: "Goal: Finish the project. Problem: We spent too much money. Solution: We need more money.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Option B correctly identifies the goal (maintain budget), clearly states the problem (exceeded by 15%), and provides a forward-looking solution seeking guidance. The other options either focus on past analysis rather than future action or are too vague."
      },
      {
        id: randomUUID(),
        text: "Team Morale Issues: You're noticing a significant drop in team morale, leading to decreased productivity. You want to address this with your department head. You have some ideas but want their input. Which GPS structured summary is best?",
        options: [
          { id: randomUUID(), text: "Goal: Boost team morale and productivity. Problem: Employee engagement surveys show a decline, and there's a lot of gossip about workload. Solution: I propose we implement flexible hours and conduct a team-building retreat, but I'd like your thoughts on these ideas.", letter: "A" },
          { id: randomUUID(), text: "Goal: Make the team happier. Problem: People are complaining a lot, and work isn't getting done as fast. Solution: We should probably just give everyone a bonus.", letter: "B" },
          { id: randomUUID(), text: "Goal: Understand the morale problem. Problem: There's a negative atmosphere on the team because of various past incidents. Solution: We need to talk about everything that went wrong leading up to this point.", letter: "C" },
          { id: randomUUID(), text: "Goal: Get more work done. Problem: The team is unproductive. Solution: We need to enforce stricter deadlines.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Option A provides a clear goal (boost morale and productivity), identifies specific evidence of the problem (survey data), and offers actionable solutions while seeking input. The other options are either too vague, focus on past incidents, or propose inappropriate solutions."
      },
      {
        id: randomUUID(),
        text: "New Software Implementation Delay: A critical new software system, essential for automating several processes, is three weeks behind schedule. Your team needs to inform senior management. Which GPS structured summary is best?",
        options: [
          { id: randomUUID(), text: "Goal: Successfully implement the new software system to automate processes. Problem: The system is three weeks behind schedule due to unexpected integration challenges with legacy systems. Solution: We need approval to extend the deadline and allocate additional developer resources for the next two sprints.", letter: "A" },
          { id: randomUUID(), text: "Goal: Automate our processes. Problem: The new software is late, but it's not our fault because the vendor delivered late. Solution: We just have to wait for the vendor.", letter: "B" },
          { id: randomUUID(), text: "Goal: Avoid future delays. Problem: We are behind. Solution: We should find a new vendor next time.", letter: "C" },
          { id: randomUUID(), text: "Goal: Get the software working. Problem: It's complicated. Solution: We will work harder.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Option A clearly states the implementation goal, explains the specific problem (integration challenges causing 3-week delay), and requests specific resources needed to move forward. The other options either blame external factors, are too vague, or don't provide actionable solutions."
      },
      {
        id: randomUUID(),
        text: "Customer Complaint About Product Quality: A key customer has complained about a recent batch of your product having quality issues. You need to discuss this with the production manager to find a resolution. Which GPS structured summary is best?",
        options: [
          { id: randomUUID(), text: "Goal: Ensure our key customer receives high-quality products. Problem: The latest batch of product XYZ has defects. Solution: We need to investigate the production line immediately to identify the root cause and initiate a recall for the affected batch.", letter: "A" },
          { id: randomUUID(), text: "Goal: Make the customer happy. Problem: The product is bad. Solution: We should offer them a full refund.", letter: "B" },
          { id: randomUUID(), text: "Goal: Figure out what went wrong. Problem: Our quality control seems to have failed somewhere down the line. Solution: Let's look at all the production logs from the past month.", letter: "C" },
          { id: randomUUID(), text: "Goal: Get rid of the bad products. Problem: We have defective products. Solution: We should stop selling them.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Option A identifies the customer-focused goal, specifies the product quality problem, and outlines immediate actionable steps (investigation and recall). The other options are either too simplistic, focus on past analysis rather than forward action, or don't address the customer relationship aspect."
      }
    ];

    // Set correct answer IDs for GPS quiz (based on answer key: B, A, A, A)
    gpsQuestions[0].correctAnswerId = gpsQuestions[0].options[1].id; // B
    gpsQuestions[1].correctAnswerId = gpsQuestions[1].options[0].id; // A  
    gpsQuestions[2].correctAnswerId = gpsQuestions[2].options[0].id; // A
    gpsQuestions[3].correctAnswerId = gpsQuestions[3].options[0].id; // A

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
