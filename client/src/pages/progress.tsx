import { useQuery } from "@tanstack/react-query";
import { BookOpen, Target, TrendingUp, Flame, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type UserProgress, type Resource } from "@shared/schema";

export default function ProgressPage() {
  const { data: progress, isLoading: progressLoading } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress", "demo-user"], // In real app, use actual user ID
  });

  const { data: resources, isLoading: resourcesLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  if (progressLoading || resourcesLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading progress...</div>;
  }

  // Calculate statistics
  const totalQuizzes = progress?.length || 0;
  const averageScore = progress?.length ? 
    Math.round(progress.reduce((sum, p) => sum + (p.score / p.totalQuestions * 100), 0) / progress.length) : 0;
  
  // Group progress by resource
  const progressByResource = resources?.map(resource => {
    const resourceProgress = progress?.filter(p => p.resourceId === resource.id) || [];
    const totalQuizzes = resourceProgress.length;
    const averageScore = totalQuizzes > 0 ? 
      Math.round(resourceProgress.reduce((sum, p) => sum + (p.score / p.totalQuestions * 100), 0) / totalQuizzes) : 0;
    
    return {
      ...resource,
      completedQuizzes: totalQuizzes,
      averageScore,
      completionPercentage: Math.min((totalQuizzes / (resource.totalQuizzes || 1)) * 100, 100),
    };
  }) || [];

  return (
    <section className="py-16 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">Your Learning Progress</h2>
          <p className="text-xl text-neutral-700">Track your journey and see how you're improving</p>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="mx-auto mb-3 text-primary" size={48} />
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">Resources</h3>
              <div className="text-2xl font-bold text-primary">{resources?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Target className="mx-auto mb-3 text-secondary" size={48} />
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">Quizzes Completed</h3>
              <div className="text-2xl font-bold text-secondary">{totalQuizzes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="mx-auto mb-3 text-accent" size={48} />
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">Average Score</h3>
              <div className="text-2xl font-bold text-accent">{averageScore}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Flame className="mx-auto mb-3 text-red-500" size={48} />
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">Study Streak</h3>
              <div className="text-2xl font-bold text-red-500">7 days</div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Progress */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">Resource Progress</h3>
            
            <div className="space-y-6">
              {progressByResource.map((resource) => (
                <div key={resource.id} className="border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-accent-gradient rounded-lg flex items-center justify-center mr-4">
                        <Clock className="text-white" size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-neutral-900">{resource.title}</h4>
                        <p className="text-neutral-600">{resource.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{Math.round(resource.completionPercentage)}%</div>
                      <div className="text-sm text-neutral-600">Complete</div>
                    </div>
                  </div>
                  
                  <Progress value={resource.completionPercentage} className="mb-4" />
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-neutral-50">
                      <CardContent className="p-3 text-center">
                        <div className="text-lg font-bold text-secondary">{resource.completedQuizzes}</div>
                        <div className="text-sm text-neutral-600">Quizzes Done</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-neutral-50">
                      <CardContent className="p-3 text-center">
                        <div className="text-lg font-bold text-accent">{resource.averageScore}%</div>
                        <div className="text-sm text-neutral-600">Avg Score</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-neutral-50">
                      <CardContent className="p-3 text-center">
                        <div className="text-lg font-bold text-primary">{resource.totalQuizzes}</div>
                        <div className="text-sm text-neutral-600">Total Quizzes</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
