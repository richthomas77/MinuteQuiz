import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Trophy, CheckCircle, Clock, Star, RotateCcw, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type UserProgress, type Quiz, type Resource } from "@shared/schema";

export default function Results() {
  const [, params] = useRoute("/results/:quizId");

  const { data: progress, isLoading } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress", "demo-user"], // In real app, use actual user ID
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
