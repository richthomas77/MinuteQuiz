import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Home from "@/pages/home";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import Progress from "@/pages/progress";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/resources/:resourceId/quiz/:quizId" component={Quiz} />
        <Route path="/results/:quizId" component={Results} />
        <Route path="/progress" component={Progress} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
