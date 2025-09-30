import { Activity, Database, Zap, Users, Building2, ChevronDown, LogOut, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Get real-time logs statistics - commented out to avoid backend dependency for now
  // const logsStats = useQuery(api.functions.logs.getLogsStats, user ? { userId: user.userId } : "skip");
  const logsStats = null; // Temporary fallback

  // Fetch organization details using organizationId - commented out to avoid backend dependency for now
  // const organization = useQuery(
  //   api.team.getOrganization,
  //   user ? { organizationId: user.organizationId as Id<"organizations"> } : "skip"
  // );
  const organization = null; // Temporary fallback

  // Handle potential errors gracefully
  const organizationError = organization instanceof Error;

  // Determine system status based on data availability and recency
  const getSystemStatus = () => {
    if (!user) return { status: "Offline", color: "bg-status-offline", textColor: "text-status-offline" };

    // Since we're not using real-time stats for now, show a default status
    return { status: "Ready", color: "bg-status-online animate-pulse", textColor: "text-status-online" };
  };

  const systemStatus = getSystemStatus();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

    // Handle potential errors gracefully - commented out since we're not using queries
  // const organizationError = organization instanceof Error;

  // Use the fetched organization data or fallback to a default
  const currentOrg = {
    id: "1",
    name: user?.organizationId ? "Your Organization" : "Loading...",
    plan: "Pro",
    logo: "/api/placeholder/32/32"
  };

  const organizations = [currentOrg]; // For now, just show the current user's organization

  return (
    <div className="flex items-center justify-between flex-1 min-w-0">
      {/* Logo and Organization Selector */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow flex-shrink-0">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="min-w-0 hidden md:block">
            <h1 className="text-xl font-bold text-foreground truncate">Instant Dev Logs</h1>
            {/* <p className="text-xs text-muted-foreground truncate">Organization Dashboard</p> */}
          </div>
        </div>

        {/* Organization Selector */}
        <div className="flex items-center gap-2 pl-4 border-l border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-2 h-auto">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentOrg.logo} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {currentOrg.name && currentOrg.name.length >= 2 ? currentOrg.name.substring(0, 2).toUpperCase() : "OR"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-medium">{currentOrg.name}</div>
                    <div className="text-xs text-muted-foreground">{currentOrg.plan}</div>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {organizations.map((org) => (
                <DropdownMenuItem key={org.id} className="flex items-center gap-2 p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={org.logo} />
                    <AvatarFallback className="bg-muted">
                      {org.name && org.name.length >= 2 ? org.name.substring(0, 2).toUpperCase() : "OR"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{org.name}</div>
                    <div className="text-xs text-muted-foreground">{org.plan} Plan</div>
                  </div>
                  {org.id === currentOrg.id && (
                    <Badge variant="secondary" className="text-xs">Current</Badge>
                  )}
                </DropdownMenuItem>
              ))}
              {/* <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 p-3 text-primary">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">Manage Organizations</span>
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* System Status */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Card className="px-3 py-1.5 bg-gradient-surface">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${systemStatus.color}`}></div>
            <span className={`text-sm font-medium whitespace-nowrap ${systemStatus.textColor}`}>
              {systemStatus.status}
            </span>
          </div>
        </Card>

        {/* User Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-2 h-auto">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{currentOrg.name}</p>
                <p className="text-xs text-muted-foreground">Pro Plan</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Quick Stats - Hide on small screens */}
        <div className="hidden lg:flex items-center gap-6">
          {/* <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <div className="text-right">
              <div className="text-sm font-bold">
                {logsStats ? logsStats.totalLogs.toLocaleString() : "0"}
              </div>
              <div className="text-xs text-muted-foreground">Total Logs</div>
            </div>
          </div> */}

          {/* <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <div className="text-right">
              <div className="text-sm font-bold">
                {logsStats ? `${logsStats.logsPerMinuteRecent.toFixed(1)}/min` : "0/min"}
              </div>
              <div className="text-xs text-muted-foreground">Current Rate</div>
            </div>
          </div> */}

          {/* <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="text-right">
              <div className="text-sm font-bold">
                {logsStats && logsStats.lastLogTimestamp
                  ? new Date(logsStats.lastLogTimestamp).toLocaleTimeString()
                  : "--:--"}
              </div>
              <div className="text-xs text-muted-foreground">Last Log</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}