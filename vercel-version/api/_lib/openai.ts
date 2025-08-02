import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Question {
  id: string;
  text: string;
  options: Array<{
    id: string;
    text: string;
    letter: string;
  }>;
  correctAnswerId: string;
  explanation: string;
}

export async function generateBonusQuestions(
  quizTitle: string,
  quizDescription: string
): Promise<Question[]> {
  try {
    const prompt = `Generate 5 multiple choice questions for a quiz about "${quizTitle}". 

Context: ${quizDescription}

Requirements:
- Focus on workplace scenarios similar to the existing questions
- Each question should have 4 options (A, B, C, D)
- Include detailed explanations for the correct answers
- Make questions practical and realistic
- Vary difficulty levels
- Don't repeat concepts from existing questions

Generate questions that test understanding of the core concepts in a fresh way.

Please respond with JSON in this exact format:
{
  "questions": [
    {
      "text": "Question text here",
      "options": [
        { "text": "Option A text", "letter": "A" },
        { "text": "Option B text", "letter": "B" },
        { "text": "Option C text", "letter": "C" },
        { "text": "Option D text", "letter": "D" }
      ],
      "correctLetter": "B",
      "explanation": "Detailed explanation of why this is correct"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert in workplace communication and professional development. Generate high-quality quiz questions that help people practice real-world scenarios."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!result.questions || !Array.isArray(result.questions)) {
      throw new Error("Invalid response format from OpenAI");
    }

    // Convert to our Question format
    const bonusQuestions: Question[] = result.questions.map((q: any) => {
      const questionId = `bonus-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const options = q.options.map((opt: { text: string; letter: string }) => ({
        id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: opt.text,
        letter: opt.letter
      }));
      
      const correctOption = options.find(opt => opt.letter === q.correctLetter);
      
      return {
        id: questionId,
        text: q.text,
        options,
        correctAnswerId: correctOption?.id || options[0].id,
        explanation: q.explanation
      };
    });

    return bonusQuestions;
  } catch (error) {
    console.error("Error generating bonus questions:", error);
    throw new Error("Failed to generate bonus questions. Please try again.");
  }
}