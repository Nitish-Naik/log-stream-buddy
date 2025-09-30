
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
  const { login } = useAuth();

  const signUp = useMutation(api.functions.auth.signUp);
  const signIn = useMutation(api.functions.auth.signIn);

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
        login(result);
        navigate("/dashboard");
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6 border border-border">
        <h2 className="text-2xl font-bold mb-4 text-center text-foreground">
          {isSignUp ? "Create your account" : "Sign in to your account"}
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
        />
        {isSignUp && (
          <input
            type="text"
            placeholder="Organization Name"
            value={organization}
            onChange={e => setOrganization(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
          />
        )}
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Sign Up" : "Sign In")}
        </button>
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
          <button type="button" className="text-sm text-muted-foreground underline" onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </form>
    </div>
  );
}
