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
      },
      {
        id: randomUUID(),
        text: "Customer Complaint: 'A customer just called. They're really unhappy about something that happened last week. It was related to that service outage, I think.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "The service outage last week made a customer unhappy.", letter: "A" },
          { id: randomUUID(), text: "I need your help with a customer complaint, as the 'Alpha' account is threatening to cancel due to the recent outage.", letter: "B" },
          { id: randomUUID(), text: "We have an issue with a customer, and it's a big deal.", letter: "C" },
          { id: randomUUID(), text: "I just got off the phone with a customer who is very upset about something.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option provides clear context ('Alpha account'), specific intent ('need your help'), and the critical key message ('threatening to cancel due to recent outage'). The other options lack specificity or clear intent."
      },
      {
        id: randomUUID(),
        text: "Software Bug: 'The system crashed again. I don't know why, but it's causing issues for a lot of people.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "The system is causing problems for users because of a crash.", letter: "A" },
          { id: randomUUID(), text: "Regarding the 'Sales CRM' system, I need your approval to roll back the recent update as it's causing frequent crashes.", letter: "B" },
          { id: randomUUID(), text: "There's a software issue that needs to be fixed urgently.", letter: "C" },
          { id: randomUUID(), text: "People are having issues with the system again; I'm not sure what to do.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option identifies the specific system ('Sales CRM'), states clear intent ('need your approval'), and provides the key message (roll back update due to crashes). The other options are too vague or lack actionable intent."
      },
      {
        id: randomUUID(),
        text: "Team Morale: 'The team seems a bit down lately. I overheard some people complaining about workload and stuff.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "The team's morale is low, and I'd like to get your advice on how to address the workload concerns.", letter: "A" },
          { id: randomUUID(), text: "People are complaining about work, so I'm telling you.", letter: "B" },
          { id: randomUUID(), text: "I've noticed some issues with team dynamics and workload.", letter: "C" },
          { id: randomUUID(), text: "We need to do something about the team's complaints.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option establishes the context (team morale), clear intent (seeking advice), and key message (workload concerns need addressing). The other options lack clear intent or are too vague about the specific issue."
      },
      {
        id: randomUUID(),
        text: "Vendor Issue: 'Our vendor, XYZ Corp, they sent us the wrong shipment again. This is like the third time this month.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "XYZ Corp sent the wrong shipment again; we need to decide whether to switch vendors.", letter: "A" },
          { id: randomUUID(), text: "I need to talk about our supplier, XYZ Corp, because there's a problem with their deliveries.", letter: "B" },
          { id: randomUUID(), text: "We're having recurring issues with shipments from XYZ Corp.", letter: "C" },
          { id: randomUUID(), text: "The vendor is messing up, and it's not the first time.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option provides context (XYZ Corp shipment issue), clear intent (need to decide on vendor switch), and key message (recurring problem requiring decision). The other options lack clear decision-making intent."
      },
      {
        id: randomUUID(),
        text: "Training Request: 'I saw a new training course offered. It looks interesting, covers a lot of new tools.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "There's a new training course available, and I think I should take it.", letter: "A" },
          { id: randomUUID(), text: "Regarding professional development, I need your approval to enroll in the 'Advanced Analytics' course next month.", letter: "B" },
          { id: randomUUID(), text: "I'm looking at training options that cover new tools and seem interesting.", letter: "C" },
          { id: randomUUID(), text: "I'd like to tell you about a new course.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option provides context (professional development), clear intent (need approval), and specific key message (Advanced Analytics course enrollment). The other options are too vague or lack specific course details and approval request."
      },
      {
        id: randomUUID(),
        text: "Client Feedback: 'Remember that client presentation? They sent us feedback. Some good, some not so good.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "The client provided some feedback, and it's a mixed bag.", letter: "A" },
          { id: randomUUID(), text: "I want to share client feedback about the recent 'Product Demo' presentation as they have some critical concerns.", letter: "B" },
          { id: randomUUID(), text: "We need to go over the client's comments from the presentation.", letter: "C" },
          { id: randomUUID(), text: "Client feedback is here; you'll want to see it.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option specifies the context (Product Demo presentation), clear intent (share feedback), and key message (critical concerns need attention). The other options are too vague about the presentation type or lack urgency indicators."
      },
      {
        id: randomUUID(),
        text: "Office Supplies: 'We're almost out of printer paper and coffee. Someone needs to order more.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "We need to order more office supplies soon.", letter: "A" },
          { id: randomUUID(), text: "I need your help with office supplies, as we're critically low on printer paper and coffee pods.", letter: "B" },
          { id: randomUUID(), text: "There's a problem with supplies; we're running out.", letter: "C" },
          { id: randomUUID(), text: "Who is in charge of ordering office supplies?", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option provides context (office supplies), clear intent (need help), and specific key message (critically low on specific items). The other options are too general or don't clearly request action."
      },
      {
        id: randomUUID(),
        text: "Travel Request: 'I need to travel next month for that conference. I checked the dates, and it clashes with something else.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "My travel plans are complicated because of a clash.", letter: "A" },
          { id: randomUUID(), text: "Regarding my 'Industry Summit' travel request, I need your approval to adjust my schedule as the dates conflict with the 'Q4 Planning' meeting.", letter: "B" },
          { id: randomUUID(), text: "I want to go to a conference, but there's a scheduling conflict.", letter: "C" },
          { id: randomUUID(), text: "Can I talk to you about my upcoming trip?", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option specifies the context (Industry Summit travel), clear intent (need approval for schedule adjustment), and key message (conflict with Q4 Planning meeting). The other options lack specific details or clear approval requests."
      },
      {
        id: randomUUID(),
        text: "System Downtime: 'The server went down last night. It was quite a mess, took us hours to get it back up.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "I'm informing you about unexpected system downtime, as the 'Production Server' experienced a critical outage last night.", letter: "A" },
          { id: randomUUID(), text: "The server had problems last night, and it took a long time to fix.", letter: "B" },
          { id: randomUUID(), text: "There was a major mess with the server that required hours of work.", letter: "C" },
          { id: randomUUID(), text: "We need to talk about what happened with the server yesterday.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option provides specific context (Production Server), clear intent (informing about downtime), and key message (critical outage occurred). The other options are too informal or lack the severity indicator of 'critical outage'."
      },
      {
        id: randomUUID(),
        text: "Performance Review: 'About my performance review... I thought it went okay, but I'm not sure what the next steps are.' Which of the following best uses framing for this scenario?",
        options: [
          { id: randomUUID(), text: "I want to clarify the next steps for my performance review.", letter: "A" },
          { id: randomUUID(), text: "Regarding my annual performance review, I need your advice on how to proceed with the development plan.", letter: "B" },
          { id: randomUUID(), text: "My performance review was fine, but I'm a bit confused.", letter: "C" },
          { id: randomUUID(), text: "I need to understand what comes after my review.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "This option provides context (annual performance review), clear intent (need advice), and specific key message (how to proceed with development plan). The other options are too vague or don't specify what type of guidance is needed."
      }
    ];

    // Set correct answer IDs for framing quiz (original 5: B, A, A, B, A + additional 10: B, B, A, A, B, B, B, B, A, B)
    framingQuestions[0].correctAnswerId = framingQuestions[0].options[1].id; // B
    framingQuestions[1].correctAnswerId = framingQuestions[1].options[0].id; // A  
    framingQuestions[2].correctAnswerId = framingQuestions[2].options[0].id; // A
    framingQuestions[3].correctAnswerId = framingQuestions[3].options[1].id; // B
    framingQuestions[4].correctAnswerId = framingQuestions[4].options[0].id; // A
    framingQuestions[5].correctAnswerId = framingQuestions[5].options[1].id; // B
    framingQuestions[6].correctAnswerId = framingQuestions[6].options[1].id; // B
    framingQuestions[7].correctAnswerId = framingQuestions[7].options[0].id; // A
    framingQuestions[8].correctAnswerId = framingQuestions[8].options[0].id; // A
    framingQuestions[9].correctAnswerId = framingQuestions[9].options[1].id; // B
    framingQuestions[10].correctAnswerId = framingQuestions[10].options[1].id; // B
    framingQuestions[11].correctAnswerId = framingQuestions[11].options[1].id; // B
    framingQuestions[12].correctAnswerId = framingQuestions[12].options[1].id; // B
    framingQuestions[13].correctAnswerId = framingQuestions[13].options[0].id; // A
    framingQuestions[14].correctAnswerId = framingQuestions[14].options[1].id; // B

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
      },
      {
        id: randomUUID(),
        text: "Outdated Employee Training Program: Your company's employee onboarding training is outdated, leading to new hires feeling unprepared and taking longer to become productive. You want to propose an overhaul to HR. Which GPS structured summary is best?",
        options: [
          { id: randomUUID(), text: "Goal: Ensure new hires are quickly and effectively integrated into their roles. Problem: Our current onboarding training is outdated, resulting in longer ramp-up times and disengagement. Solution: We need to develop a modernized training program focusing on hands-on modules and mentorship, and I have a draft proposal to share.", letter: "A" },
          { id: randomUUID(), text: "Goal: Improve new hire experience. Problem: New people don't know what they're doing. Solution: HR needs to fix the training.", letter: "B" },
          { id: randomUUID(), text: "Goal: Update old training. Problem: The training materials are boring and irrelevant. Solution: We should just get rid of it.", letter: "C" },
          { id: randomUUID(), text: "Goal: Be more efficient. Problem: New hires aren't productive fast enough. Solution: We should fire them if they don't learn quickly.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Option A sets a clear goal for new hire integration, pinpoints the problem (outdated training causing slow ramp-up), and offers a concrete, actionable solution with a readiness to present details."
      },
      {
        id: randomUUID(),
        text: "Server Downtime Report: You are reporting to the IT Director about a recent server downtime that affected critical operations for an hour. The issue has been resolved. Which GPS structured summary is best?",
        options: [
          { id: randomUUID(), text: "Goal: Maintain continuous server uptime for critical operations. Problem: The main production server was down for one hour yesterday due to a power surge. Solution: We have already installed a new UPS system and improved our surge protection protocols to prevent recurrence.", letter: "A" },
          { id: randomUUID(), text: "Goal: Inform you about the server. Problem: The server crashed. Solution: It's fixed now.", letter: "B" },
          { id: randomUUID(), text: "Goal: Document the incident. Problem: The server went down, and it was quite disruptive, but we're not sure why. Solution: We need to analyze all the logs from the last 24 hours to find the real problem.", letter: "C" },
          { id: randomUUID(), text: "Goal: Avoid future downtime. Problem: We had a power surge. Solution: We need to ask for a bigger budget for IT infrastructure.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Option A clearly states the goal (uptime), the specific problem (downtime due to power surge), and a solution that highlights actions already taken to address the issue and prevent recurrence, making it forward-looking and positive."
      },
      {
        id: randomUUID(),
        text: "Insufficient Marketing Campaign Performance: A recent marketing campaign generated lower-than-expected leads, impacting sales targets. You need to strategize with the sales manager. Which GPS structured summary is best?",
        options: [
          { id: randomUUID(), text: "Goal: Generate sufficient leads to meet sales targets. Problem: Our Q2 marketing campaign generated 30% fewer leads than projected. Solution: I'd like to collaborate on analyzing campaign data to identify weak points and develop a revised strategy for Q3.", letter: "A" },
          { id: randomUUID(), text: "Goal: Get more leads. Problem: The marketing campaign didn't work very well. Solution: Marketing needs to try harder next time.", letter: "B" },
          { id: randomUUID(), text: "Goal: Blame someone. Problem: Sales didn't follow up on the leads properly, so it's their fault the numbers are low. Solution: We need to hold a meeting to discuss sales' lead conversion process.", letter: "C" },
          { id: randomUUID(), text: "Goal: Get the numbers up. Problem: We are behind our sales targets. Solution: We need to discount our products heavily.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Option A defines the clear goal (sufficient leads), the measurable problem (30% fewer leads than projected), and an actionable solution focused on collaboration and future strategy development."
      },
      {
        id: randomUUID(),
        text: "Overwhelmed Customer Support Team: Your customer support team is overwhelmed with inquiries, leading to long wait times and frustrated customers. You want to request additional staffing from operations management. Which GPS structured summary is best?",
        options: [
          { id: randomUUID(), text: "Goal: Provide timely and effective customer support. Problem: The volume of customer inquiries has increased by 25% this month, leading to average wait times exceeding 10 minutes. Solution: We need to hire two additional customer support agents to handle the increased load.", letter: "A" },
          { id: randomUUID(), text: "Goal: Help our customers. Problem: Our customers are getting angry because they wait too long. Solution: We need to tell them to be more patient.", letter: "B" },
          { id: randomUUID(), text: "Goal: Make the team less stressed. Problem: The support team is complaining about being busy. Solution: We should reduce their workload by removing some responsibilities.", letter: "C" },
          { id: randomUUID(), text: "Goal: Improve customer satisfaction. Problem: Our support team is small. Solution: Let's train our existing staff to be faster.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Option A presents a clear service goal, a quantifiable problem (increased volume, longer wait times), and a direct, actionable solution (hiring more staff)."
      },
      {
        id: randomUUID(),
        text: "Project Team Member Leaving: A key team member essential for your current project is leaving next month, creating a significant knowledge gap and potential delays. You need to inform your project sponsor. Which GPS structured summary is best?",
        options: [
          { id: randomUUID(), text: "Goal: Ensure the project remains on schedule and within quality standards. Problem: John, our lead developer, is leaving in four weeks, creating a critical knowledge gap for the XYZ module. Solution: We need to immediately begin cross-training other team members and accelerate recruitment for his replacement.", letter: "A" },
          { id: randomUUID(), text: "Goal: Keep the project going. Problem: Someone important is leaving the team. Solution: We just have to hope for the best.", letter: "B" },
          { id: randomUUID(), text: "Goal: Find a new person. Problem: John is gone. Solution: Post a job opening quickly.", letter: "C" },
          { id: randomUUID(), text: "Goal: Avoid disruption. Problem: We might miss the deadline if John leaves. Solution: We need to try to convince him to stay longer.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Option A clearly states the project-focused goal, the specific problem (key team member leaving and knowledge gap), and immediate, actionable steps to mitigate the impact."
      },
      {
        id: randomUUID(),
        text: "Proposal for New Vendor: You've found a new vendor that could significantly reduce costs for a specific component. You want to present this to procurement for approval. Which GPS structured summary is best?",
        options: [
          { id: randomUUID(), text: "Goal: Reduce the cost of component X by 15%. Problem: Our current vendor's pricing for component X is significantly higher than market rates. Solution: I recommend we switch to 'NewCo' as they offer the same quality at a 15% lower cost, and I have prepared a comparative analysis for your review.", letter: "A" },
          { id: randomUUID(), text: "Goal: Save money. Problem: Our current vendor is expensive. Solution: We should just stop buying from them.", letter: "B" },
          { id: randomUUID(), text: "Goal: Get approval for a new vendor. Problem: I found a cheaper vendor. Solution: Can you approve this?", letter: "C" },
          { id: randomUUID(), text: "Goal: Find better deals. Problem: We are spending too much. Solution: We need to review all our vendor contracts.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Option A defines a measurable goal (15% cost reduction), a clear problem (high current vendor pricing), and a specific, actionable solution with supporting information."
      },
      {
        id: randomUUID(),
        text: "Cybersecurity Vulnerability Identified: A security audit has identified a critical cybersecurity vulnerability in your internal network that needs immediate attention to prevent a data breach. You are informing the CISO. Which GPS structured summary is best?",
        options: [
          { id: randomUUID(), text: "Goal: Secure our internal network and protect sensitive data. Problem: A recent audit revealed a critical vulnerability (CVE-2023-XXX) that could lead to a data breach within 48 hours. Solution: We have already isolated the affected systems and need immediate authorization to deploy the emergency patch developed by the security team.", letter: "A" },
          { id: randomUUID(), text: "Goal: Pass future audits. Problem: We have a security flaw. Solution: We need to hide it until the next audit.", letter: "B" },
          { id: randomUUID(), text: "Goal: Prevent a hack. Problem: Our network is vulnerable. Solution: We need to hire more cybersecurity experts.", letter: "C" },
          { id: randomUUID(), text: "Goal: Inform you. Problem: We found a security vulnerability in our network. Solution: Nothing yet, we are still analyzing it.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Option A clearly states the security goal, identifies the urgent and specific problem (critical vulnerability with breach risk), and outlines immediate actions already taken and what authorization is needed for the solution."
      },
      {
        id: randomUUID(),
        text: "Decline in Website Traffic: Your company website has seen a steady decline in traffic over the past quarter, impacting online sales. You need to discuss this with the marketing lead. Which GPS structured summary is best?",
        options: [
          { id: randomUUID(), text: "Goal: Increase website traffic to boost online sales. Problem: Website traffic has decreased by 10% each month over the last quarter, directly affecting conversion rates. Solution: We need to review our SEO strategy and content marketing efforts, and I'd like to schedule a deep-dive meeting to brainstorm specific actions.", letter: "A" },
          { id: randomUUID(), text: "Goal: Get more people to our website. Problem: People aren't visiting our site. Solution: We need more advertising.", letter: "B" },
          { id: randomUUID(), text: "Goal: Understand the trend. Problem: Website traffic is down, but we don't know why. Solution: We should look at competitor websites.", letter: "C" },
          { id: randomUUID(), text: "Goal: Keep sales up. Problem: Online sales are dropping. Solution: Offer discounts on everything.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Option A sets a clear, measurable goal (increase traffic, boost sales), a specific problem (quantifiable traffic decrease impacting conversions), and a forward-looking, collaborative solution to explore specific actions."
      },
      {
        id: randomUUID(),
        text: "Inter-departmental Conflict: There's ongoing tension between the R&D and Production departments over project handoffs, causing delays and rework. You want to facilitate a resolution with both department heads. Which GPS structured summary is best?",
        options: [
          { id: randomUUID(), text: "Goal: Improve collaboration and efficiency between R&D and Production during project handoffs. Problem: Miscommunication and conflicting priorities during project handoffs are causing significant delays and rework, delaying product launches. Solution: I propose we jointly develop a standardized handoff protocol and schedule a cross-functional workshop to align on shared objectives.", letter: "A" },
          { id: randomUUID(), text: "Goal: Stop the fighting. Problem: R&D and Production don't get along. Solution: They just need to talk more.", letter: "B" },
          { id: randomUUID(), text: "Goal: Get products out faster. Problem: R&D keeps designing things that Production can't build easily. Solution: R&D needs to simplify their designs.", letter: "C" },
          { id: randomUUID(), text: "Goal: Inform you. Problem: There's a lot of blame shifting between R&D and Production. Solution: Not sure, I just wanted to make you aware.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Option A identifies the collaboration goal, specifies the handoff problem causing delays, and proposes concrete solutions (standardized protocol and workshop) to address root causes."
      },
      {
        id: randomUUID(),
        text: "Critical Equipment Failure: A critical piece of machinery in your factory has broken down, halting production. You need to inform the operations director and suggest immediate next steps. Which GPS structured summary is best?",
        options: [
          { id: randomUUID(), text: "Goal: Resume full production capacity as quickly as possible. Problem: Machine 7B, critical for Widget X production, has suffered a major mechanical failure, halting our main line. Solution: We need to immediately procure replacement parts and schedule emergency repairs, and I've already contacted two suppliers for quotes and technician availability.", letter: "A" },
          { id: randomUUID(), text: "Goal: Tell you the bad news. Problem: The machine broke. Solution: We are waiting for it to be fixed.", letter: "B" },
          { id: randomUUID(), text: "Goal: Avoid future breakdowns. Problem: The machine is old. Solution: We need to buy new equipment.", letter: "C" },
          { id: randomUUID(), text: "Goal: Fix the machine. Problem: It stopped working this morning. Solution: I'm not sure, I'm still trying to diagnose the issue.", letter: "D" }
        ],
        correctAnswerId: "",
        explanation: "Option A clearly states the production goal, identifies the specific equipment problem, and outlines immediate, actionable steps already initiated to resolve the issue quickly."
      }
    ];

    // Set correct answer IDs for GPS quiz (original 4: B, A, A, A + additional 10: all A)
    gpsQuestions[0].correctAnswerId = gpsQuestions[0].options[1].id; // B
    gpsQuestions[1].correctAnswerId = gpsQuestions[1].options[0].id; // A  
    gpsQuestions[2].correctAnswerId = gpsQuestions[2].options[0].id; // A
    gpsQuestions[3].correctAnswerId = gpsQuestions[3].options[0].id; // A
    gpsQuestions[4].correctAnswerId = gpsQuestions[4].options[0].id; // A
    gpsQuestions[5].correctAnswerId = gpsQuestions[5].options[0].id; // A
    gpsQuestions[6].correctAnswerId = gpsQuestions[6].options[0].id; // A
    gpsQuestions[7].correctAnswerId = gpsQuestions[7].options[0].id; // A
    gpsQuestions[8].correctAnswerId = gpsQuestions[8].options[0].id; // A
    gpsQuestions[9].correctAnswerId = gpsQuestions[9].options[0].id; // A
    gpsQuestions[10].correctAnswerId = gpsQuestions[10].options[0].id; // A
    gpsQuestions[11].correctAnswerId = gpsQuestions[11].options[0].id; // A
    gpsQuestions[12].correctAnswerId = gpsQuestions[12].options[0].id; // A
    gpsQuestions[13].correctAnswerId = gpsQuestions[13].options[0].id; // A

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
