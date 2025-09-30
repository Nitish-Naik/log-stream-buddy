import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import AuthForm from "./pages/Signup";
import Index from "./pages/Index";
import Reports from "./pages/Reports";
import TeamManagement from "./pages/TeamManagement";
import OrganizationSettings from "./pages/OrganizationSettings";
import NotFound from "./pages/NotFound";

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signup" element={<AuthForm />} />
    <Route path="/login" element={<AuthForm />} />
    <Route path="/dashboard" element={<Index />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/team" element={<TeamManagement />} />
          <Route path="/settings" element={<OrganizationSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
);

export default App;
