import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Quiz, type Resource, type Question, type InsertUserProgress } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/resources/:resourceId/quiz/:quizId");
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const { data: quiz, isLoading: quizLoading } = useQuery<Quiz>({
    queryKey: ["/api/quizzes", params?.quizId],
  });

  const { data: resource } = useQuery<Resource>({
    queryKey: ["/api/resources", params?.resourceId],
  });

  const saveProgressMutation = useMutation({
    mutationFn: async (progress: InsertUserProgress) => {
      await apiRequest("POST", "/api/progress", progress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      setLocation(`/results/${params?.quizId}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save quiz progress",
        variant: "destructive",
      });
    },
  });

  if (quizLoading || !quiz || !resource) {
    return <div className="min-h-screen flex items-center justify-center">Loading quiz...</div>;
  }

  const questions = quiz.questions as Question[];
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerId: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerId
    }));
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowFeedback(false);
    } else {
      // Quiz complete - calculate score and save progress
      const correctAnswers = questions.filter(q => answers[q.id] === q.correctAnswerId).length;
      
      const progressData: InsertUserProgress = {
        userId: "demo-user", // In a real app, this would come from auth
        resourceId: resource.id,
        quizId: quiz.id,
        score: correctAnswers,
        totalQuestions: questions.length,
        answers: answers,
      };

      saveProgressMutation.mutate(progressData);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowFeedback(!!answers[questions[currentQuestionIndex - 1].id]);
    }
  };

  const selectedAnswer = answers[currentQuestion.id];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswerId;

  return (
    <section className="py-16 bg-neutral-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quiz Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="mr-4">
                  <ArrowLeft size={18} />
                </Button>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">{resource.title}</h2>
                  <p className="text-neutral-600">{quiz.title}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
                <Progress value={progressPercent} className="w-32 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Question Card */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-6 leading-relaxed">
              {currentQuestion.text}
            </h3>

            {/* Answer Options */}
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect} className="space-y-4">
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
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="mr-2" size={16} />
                Previous
              </Button>
              <div className="flex space-x-3">
                <Button variant="ghost" onClick={handleNext}>
                  Skip
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!selectedAnswer || saveProgressMutation.isPending}
                >
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
                  <span className="text-white text-sm">
                    {isCorrect ? "✓" : "✗"}
                  </span>
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
    </section>
  );
}
