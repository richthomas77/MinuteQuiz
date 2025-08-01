import { useQuery } from "@tanstack/react-query";
import { BookOpen, Play, Book, Plus, Clock, Brain, Target } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Resource, type Quiz } from "@shared/schema";
import bookCoverImage from "@assets/TFM_1754083535157.png";

function QuizList({ resourceId }: { resourceId: string }) {
  const { data: quizzes } = useQuery<Quiz[]>({
    queryKey: ["/api/resources", resourceId, "quizzes"],
    enabled: !!resourceId,
  });

  if (!quizzes || quizzes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz, index) => (
        <Card key={quiz.id} className="border-2 border-neutral-200 hover:border-primary transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                  {index === 0 ? <Brain className="text-white" size={20} /> : <Target className="text-white" size={20} />}
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">{quiz.title}</h4>
                  <p className="text-sm text-neutral-600">{quiz.description}</p>
                </div>
              </div>
              <Link href={`/resources/${resourceId}/quiz/${quiz.id}`}>
                <Button size="sm">
                  <Play className="mr-2" size={16} />
                  Start
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function Home() {
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-primary-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen size={96} className="mx-auto mb-6 opacity-90" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Practice What You Read</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Transform passive reading into active learning. Test your understanding with interactive quizzes based on the books you've studied.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-primary hover:bg-neutral-100 text-lg px-8 py-4">
              <Play className="mr-2" size={20} />
              Start Practicing
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4">
              <Book className="mr-2" size={20} />
              Browse Resources
            </Button>
          </div>
        </div>
      </section>

      {/* Resource Selection */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Choose Your Learning Resource</h2>
            <p className="text-xl text-neutral-700 max-w-2xl mx-auto">
              Select from our collection of books and resources to practice with targeted quizzes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources?.map((resource) => (
              <div key={resource.id} className="space-y-6">
                {/* Resource Card */}
                <Card className="bg-accent-gradient overflow-hidden transform hover:scale-105 transition-transform">
                  <div className="h-48 bg-cover bg-center relative" style={{
                    backgroundImage: `url('${resource.title === "The First Minute" ? bookCoverImage : resource.coverImageUrl || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400'}')`
                  }}>
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <BookOpen size={48} className="mx-auto mb-2" />
                        <h3 className="text-2xl font-bold">{resource.title}</h3>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">Featured</span>
                      <span className="text-sm opacity-90">{resource.totalQuizzes} Quizzes</span>
                    </div>
                    <p className="text-sm opacity-90 mb-4">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <div className="w-24 bg-white bg-opacity-20 rounded-full h-2 mr-2">
                          <div className="bg-white h-2 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                        <span className="text-xs">60%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quiz Cards for this resource */}
                <QuizList resourceId={resource.id} />
              </div>
            ))}

            {/* Add New Resource Card */}
            <Link href="/admin">
              <Card className="border-2 border-dashed border-neutral-300 hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-8 text-center">
                  <Plus size={64} className="mx-auto mb-4 text-neutral-400" />
                  <h3 className="text-xl font-semibold text-neutral-700 mb-2">Add New Resource</h3>
                  <p className="text-neutral-500">Upload quiz documents for a new book or resource</p>
                </CardContent>
              </Card>
            </Link>

            {/* Coming Soon Card */}
            <Card className="bg-neutral-100">
              <CardContent className="p-8 text-center">
                <Book size={64} className="mx-auto mb-4 text-neutral-400" />
                <h3 className="text-xl font-semibold text-neutral-700 mb-2">Coming Soon</h3>
                <p className="text-neutral-500">More resources will be available soon</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
