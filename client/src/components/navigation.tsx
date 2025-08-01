import { Link, useLocation } from "wouter";
import { GraduationCap, User } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <GraduationCap className="text-primary text-2xl mr-3" size={32} />
            <Link href="/">
              <h1 className="text-xl font-bold text-neutral-900 cursor-pointer">LearnPractice</h1>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <span className={`${isActive("/") ? "text-primary font-medium border-b-2 border-primary pb-1" : "text-neutral-700 hover:text-primary"} transition-colors cursor-pointer`}>
                Practice Quizzes
              </span>
            </Link>
            <Link href="/progress">
              <span className={`${isActive("/progress") ? "text-primary font-medium border-b-2 border-primary pb-1" : "text-neutral-700 hover:text-primary"} transition-colors cursor-pointer`}>
                Progress
              </span>
            </Link>
            <Link href="/admin">
              <span className={`${isActive("/admin") ? "text-primary font-medium border-b-2 border-primary pb-1" : "text-neutral-700 hover:text-primary"} transition-colors cursor-pointer`}>
                Admin
              </span>
            </Link>
          </nav>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="text-white" size={16} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
