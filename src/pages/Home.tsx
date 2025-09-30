

import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5 bg-card/80 shadow-lg backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center shadow-glow">
            <span className="font-bold text-2xl text-white tracking-tight">ID</span>
          </span>
          <span className="font-extrabold text-2xl text-foreground tracking-tight">Instant Dev Logs</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="text-foreground hover:text-primary px-4 py-2 rounded-lg font-medium transition-colors duration-150"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
          <button
            className="bg-gradient-to-r from-primary to-green-500 text-white px-7 py-2 rounded-xl font-bold shadow-lg hover:scale-105 hover:from-primary/90 hover:to-green-400 transition-all duration-150"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Features Section */}
      <section className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto p-10 bg-card/90 rounded-2xl shadow-2xl border border-border backdrop-blur-md">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-foreground tracking-tight">
            Welcome to <span className="text-primary">Instant Dev Logs</span>
          </h1>
          <ul className="space-y-6 text-lg">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={28} />
              <span className="font-medium text-foreground">Real-time log streaming and analytics</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={28} />
              <span className="font-medium text-foreground">Organization dashboard with error/warning tracking</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={28} />
              <span className="font-medium text-foreground">Team management and role-based access</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={28} />
              <span className="font-medium text-foreground">Custom reports and uptime monitoring</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={28} />
              <span className="font-medium text-foreground">Secure authentication and organization onboarding</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
