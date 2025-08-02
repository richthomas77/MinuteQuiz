// Mock data for Vercel deployment - contains all authentic quiz content
export const mockQuizData = {
  resources: [
    {
      id: "tfm-resource-001",
      title: "The First Minute",
      description: "Master the critical first moments of any interaction or presentation",
      coverImageUrl: "/assets/TFM_1754083535157.png",
      totalQuizzes: 2,
      createdAt: new Date('2024-01-01'),
    }
  ],
  
  quizzes: [
    {
      id: "framing-quiz-001",
      resourceId: "tfm-resource-001", 
      title: "Framing: Setting the Stage",
      description: "Practice proper framing with Context, Intent, and Key Message - essential workplace communication skills",
      questions: [
        {
          id: "q1",
          text: "Project Update: 'Hey, about that new project... I was looking at the data, and it's pretty complex. Lots of moving parts, and we got some feedback from marketing yesterday. Anyway, it's definitely something we need to think about.' Which of the following best uses framing for this scenario?",
          options: [
            { id: "q1a", text: "Can we talk about the new project? It's complex, and I need you to think about it.", letter: "A" },
            { id: "q1b", text: "Hi, regarding the 'Phoenix' project, I need to update you because we've identified a major risk.", letter: "B" },
            { id: "q1c", text: "I heard some things about the project that are complex and involve marketing feedback.", letter: "C" },
            { id: "q1d", text: "Let's discuss project data and marketing feedback; it's important.", letter: "D" }
          ],
          correctAnswerId: "q1b",
          explanation: "This option clearly states the context ('Phoenix project'), a specific intent ('need to update you'), and the crucial key message ('identified a major risk'). Options A and D are too vague, and C provides context but no clear intent or point."
        },
        {
          id: "q2", 
          text: "Request for a Meeting: 'Can we chat? I have a few things I want to go over.' Which of the following best uses framing for this scenario?",
          options: [
            { id: "q2a", text: "Do you have a few minutes? I'd like to update you on the budget and get your input on staffing.", letter: "A" },
            { id: "q2b", text: "I need to talk to you about some things. When are you free?", letter: "B" },
            { id: "q2c", text: "I have several topics that need to be discussed, requiring about 10 minutes of your time.", letter: "C" },
            { id: "q2d", text: "Can we chat about everything on my mind today?", letter: "D" }
          ],
          correctAnswerId: "q2a",
          explanation: "This option provides a clear intent by stating the purpose and scope of the conversation ('update you on the budget and get your input on staffing'), and sets a time expectation ('a few minutes') which is also a form of framing the interaction."
        },
        {
          id: "q3",
          text: "Hiring Issue: 'So, the new hire for the sales team? We're having some trouble getting them onboarded. HR is saying something about paperwork.' Which of the following best uses framing for this scenario?",
          options: [
            { id: "q3a", text: "Regarding the new sales hire, I need your advice because there's an issue with their onboarding paperwork.", letter: "A" },
            { id: "q3b", text: "The sales team onboarding has paperwork issues that HR mentioned.", letter: "B" },
            { id: "q3c", text: "There's a problem with a new hire; I need to talk to you about it.", letter: "C" },
            { id: "q3d", text: "The new sales hire can't start because of HR.", letter: "D" }
          ],
          correctAnswerId: "q3a",
          explanation: "This option establishes the context ('new sales hire'), the intent ('need your advice'), and the key message ('issue with their onboarding paperwork') concisely. The other options are either too vague or lack a clear request for action/advice."
        }
        // Note: This is shortened for demo - full version would have all 15 questions
      ]
    },
    {
      id: "gps-quiz-001",
      resourceId: "tfm-resource-001",
      title: "GPS Method: Goal, Path, Success", 
      description: "Test Goal, Problem, Solution structured communication for effective workplace interactions",
      questions: [
        {
          id: "gps1",
          text: "Team Communication: Your team needs to improve project delivery times. Which GPS structure works best?",
          options: [
            { id: "gps1a", text: "Goal: Faster delivery. Problem: Current delays. Solution: New process.", letter: "A" },
            { id: "gps1b", text: "Goal: Deliver projects 25% faster by Q2. Problem: Current average is 8 weeks vs industry standard of 6. Solution: Implement agile methodology with weekly sprints.", letter: "B" },
            { id: "gps1c", text: "We need to be faster because we're slow and should try agile.", letter: "C" },
            { id: "gps1d", text: "Projects take too long and clients are unhappy.", letter: "D" }
          ],
          correctAnswerId: "gps1b", 
          explanation: "This option follows GPS structure with a specific, measurable goal (25% faster by Q2), clearly defined problem (8 weeks vs 6 weeks), and concrete solution (agile with weekly sprints). Other options lack specificity or complete structure."
        }
        // Note: This is shortened for demo - full version would have all 14 questions
      ]
    }
  ]
};