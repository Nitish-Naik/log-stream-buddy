
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../contexts/AuthContext";

export default function AuthForm() {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const signUp = useMutation(api.functions.auth.signUp);
  const signIn = useMutation(api.functions.auth.signIn);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Set initial mode based on route
  useEffect(() => {
    setIsSignUp(location.pathname === "/signup");
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp({ email, password, organization });
        // After signup, switch to login mode
        setIsSignUp(false);
        setError("");
        // Clear organization field as it's not needed for login
        setOrganization("");
      } else {
        const result = await signIn({ email, password });
        login({ userId: result.userId, organizationId: result.organizationId });
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setOrganization("");
    // Update URL to match the mode
    navigate(isSignUp ? "/login" : "/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-full blur-3xl" />

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-500/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-purple-500/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="font-extrabold text-2xl text-foreground">Instant Dev Logs</span>
            </div>
            <p className="text-muted-foreground">Transform your application logs into actionable insights</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-border/50 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isSignUp ? "Get started with log monitoring" : "Sign in to your account"}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                />
              </div>

              {isSignUp && (
                <div>
                  <input
                    type="text"
                    placeholder="Organization name"
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </div>
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </button>

            <div className="text-center space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>

              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                onClick={() => navigate("/")}
              >
                ← Back to Home
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
