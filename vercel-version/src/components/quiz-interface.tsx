import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { type Question } from "@shared/schema";

interface QuizInterfaceProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  onAnswerSelect: (questionId: string, answerId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onBackToResources: () => void;
  showFeedback: boolean;
}

export default function QuizInterface({
  questions,
  currentQuestionIndex,
  answers,
  onAnswerSelect,
  onNext,
  onPrevious,
  onBackToResources,
  showFeedback,
}: QuizInterfaceProps) {
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
  const selectedAnswer = answers[currentQuestion.id];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswerId;

  return (
    <div className="space-y-6">
      {/* Quiz Question Card */}
      <Card>
        <CardContent className="p-8">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6 leading-relaxed">
            {currentQuestion.text}
          </h3>

          {/* Answer Options */}
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={(value) => onAnswerSelect(currentQuestion.id, value)}
            className="space-y-4"
          >
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-start">
                <Label
                  htmlFor={option.id}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer w-full transition-all ${
                    selectedAnswer === option.id
                      ? "border-primary bg-primary bg-opacity-5"
                      : "border-neutral-200 hover:border-primary hover:bg-primary hover:bg-opacity-5"
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1 mr-4" />
                  <div className="flex items-center flex-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                      selectedAnswer === option.id ? "bg-primary text-white" : "bg-neutral-200"
                    }`}>
                      {option.letter}
                    </span>
                    <span className="text-neutral-900 font-medium">{option.text}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Quiz Actions */}
          <div className="flex justify-between items-center mt-8">
            <Button 
              variant="ghost" 
              onClick={onPrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="mr-2" size={16} />
              Previous
            </Button>
            <div className="flex space-x-3">
              <Button variant="ghost" onClick={onNext}>
                Skip
              </Button>
              <Button onClick={onNext} disabled={!selectedAnswer}>
                {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                <ChevronRight className="ml-2" size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Feedback */}
      {showFeedback && selectedAnswer && (
        <Card className={`${isCorrect ? "bg-secondary bg-opacity-10 border-secondary" : "bg-destructive bg-opacity-10 border-destructive"}`}>
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                isCorrect ? "bg-secondary" : "bg-destructive"
              }`}>
                {isCorrect ? <Check className="text-white" size={16} /> : <X className="text-white" size={16} />}
              </div>
              <div>
                <h4 className={`font-semibold mb-2 ${isCorrect ? "text-secondary" : "text-destructive"}`}>
                  {isCorrect ? "Correct!" : "Incorrect"}
                </h4>
                <p className="text-neutral-700">{currentQuestion.explanation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
