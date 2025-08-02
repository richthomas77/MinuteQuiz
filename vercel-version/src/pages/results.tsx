import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Trophy, CheckCircle, Clock, Star, RotateCcw, ArrowRight, BarChart3, Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { type UserProgress, type Quiz, type Resource, type Question } from "../types/schema";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

export default function Results() {
  const [, params] = useRoute("/results/:quizId");
  const [showBonusQuestions, setShowBonusQuestions] = useState(false);
  const [bonusQuestions, setBonusQuestions] = useState<Question[]>([]);
  const [currentBonusQuestion, setCurrentBonusQuestion] = useState(0);
  const [bonusAnswers, setBonusAnswers] = useState<Record<string, string>>({});
  const [bonusCompleted, setBonusCompleted] = useState(false);
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress", "demo-user"], // In real app, use actual user ID
  });

  const generateBonusMutation = useMutation({
    mutationFn: async (quizId: string) => {
      const response = await apiRequest("POST", `/api/quizzes/${quizId}/bonus-questions`);
      return response.json();
    },
    onSuccess: (data) => {
      setBonusQuestions(data.questions);
      setShowBonusQuestions(true);
    },
  });

  const { data: quiz } = useQuery<Quiz>({
    queryKey: ["/api/quizzes", params?.quizId],
  });

  const { data: resource } = useQuery<Resource>({
    queryKey: ["/api/resources", quiz?.resourceId],
    enabled: !!quiz?.resourceId,
  });

  if (isLoading || !progress || !quiz || !resource) {
    return <div className="min-h-screen flex items-center justify-center">Loading results...</div>;
  }

  // Find the latest progress for this quiz
  const quizProgress = progress
    .filter(p => p.quizId === params?.quizId)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0];

  if (!quizProgress) {
    return <div className="min-h-screen flex items-center justify-center">No results found</div>;
  }

  const scorePercentage = Math.round((quizProgress.score / quizProgress.totalQuestions) * 100);
  const grade = scorePercentage >= 90 ? "A" : scorePercentage >= 80 ? "B+" : scorePercentage >= 70 ? "B" : scorePercentage >= 60 ? "C" : "F";

  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Results Header */}
        <Card className="bg-gradient-to-br from-secondary to-green-600 text-white mb-8">
          <CardContent className="p-12">
            <Trophy size={96} className="mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4">Quiz Complete!</h2>
            <p className="text-xl opacity-90 mb-6">Great job on "{quiz.title}"</p>
            
            {/* Score Display */}
            <Card className="bg-white bg-opacity-20 max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="text-5xl font-bold mb-2">{quizProgress.score}/{quizProgress.totalQuestions}</div>
                <div className="text-lg opacity-90">Your Score</div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mt-4">
                  <div className="bg-white h-3 rounded-full transition-all duration-500" style={{ width: `${scorePercentage}%` }}></div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-neutral-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="mx-auto mb-3 text-secondary" size={48} />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Correct Answers</h3>
              <div className="text-3xl font-bold text-secondary">{quizProgress.score}</div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-50">
            <CardContent className="p-6 text-center">
              <Clock className="mx-auto mb-3 text-accent" size={48} />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Accuracy</h3>
              <div className="text-3xl font-bold text-accent">{scorePercentage}%</div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-50">
            <CardContent className="p-6 text-center">
              <Star className="mx-auto mb-3 text-yellow-500" size={48} />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Grade</h3>
              <div className="text-3xl font-bold text-yellow-500">{grade}</div>
            </CardContent>
          </Card>
        </div>

        {/* Bonus Questions Feature */}
        {!showBonusQuestions && !bonusCompleted && (
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-8">
            <CardContent className="p-6 text-center">
              <Brain size={48} className="mx-auto mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-2">Want More Practice?</h3>
              <p className="text-lg opacity-90 mb-4">
                Get 5 AI-generated bonus questions tailored to "{quiz.title}"
              </p>
              <Button 
                onClick={() => generateBonusMutation.mutate(quiz.id)}
                disabled={generateBonusMutation.isPending}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                <Sparkles className="mr-2" size={20} />
                {generateBonusMutation.isPending ? "Generating..." : "Generate Bonus Questions"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bonus Quiz Interface */}
        {showBonusQuestions && !bonusCompleted && bonusQuestions.length > 0 && (
          <Card className="mb-8 border-2 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-600">
                  <Sparkles className="inline mr-2" size={20} />
                  Bonus Question {currentBonusQuestion + 1} of {bonusQuestions.length}
                </h3>
                <div className="text-sm text-gray-500">
                  AI-Generated Practice
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-lg font-medium mb-4">
                  {bonusQuestions[currentBonusQuestion]?.text}
                </p>
                
                <div className="space-y-3">
                  {bonusQuestions[currentBonusQuestion]?.options.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        bonusAnswers[bonusQuestions[currentBonusQuestion].id] === option.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`bonus-${bonusQuestions[currentBonusQuestion].id}`}
                        value={option.id}
                        checked={bonusAnswers[bonusQuestions[currentBonusQuestion].id] === option.id}
                        onChange={() => setBonusAnswers(prev => ({
                          ...prev,
                          [bonusQuestions[currentBonusQuestion].id]: option.id
                        }))}
                        className="sr-only"
                      />
                      <span className="w-6 h-6 border-2 border-purple-500 rounded-full mr-3 flex items-center justify-center">
                        {bonusAnswers[bonusQuestions[currentBonusQuestion].id] === option.id && (
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        )}
                      </span>
                      <span className="font-medium mr-3">{option.letter}.</span>
                      <span>{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentBonusQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentBonusQuestion === 0}
                >
                  Previous
                </Button>
                
                {currentBonusQuestion === bonusQuestions.length - 1 ? (
                  <Button
                    onClick={() => setBonusCompleted(true)}
                    disabled={!bonusAnswers[bonusQuestions[currentBonusQuestion].id]}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Complete Bonus
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentBonusQuestion(prev => prev + 1)}
                    disabled={!bonusAnswers[bonusQuestions[currentBonusQuestion].id]}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bonus Completed */}
        {bonusCompleted && (
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-8">
            <CardContent className="p-6 text-center">
              <Trophy size={48} className="mx-auto mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-2">Bonus Complete!</h3>
              <p className="text-lg opacity-90 mb-4">
                You completed 5 additional AI-generated questions
              </p>
              <div className="text-3xl font-bold">
                {Object.values(bonusAnswers).filter((answer, index) => 
                  answer === bonusQuestions[index]?.correctAnswerId
                ).length}/5 Correct
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Handling */}
        {generateBonusMutation.isError && (
          <Alert className="mb-8">
            <AlertDescription>
              Failed to generate bonus questions. Please try again or check your connection.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/resources/${resource.id}/quiz/${quiz.id}`}>
            <Button size="lg" className="w-full sm:w-auto">
              <RotateCcw className="mr-2" size={20} />
              Retake Quiz
            </Button>
          </Link>
          
          <Link href="/">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              <ArrowRight className="mr-2" size={20} />
              More Quizzes
            </Button>
          </Link>
          
          <Link href="/progress">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <BarChart3 className="mr-2" size={20} />
              View Progress
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
