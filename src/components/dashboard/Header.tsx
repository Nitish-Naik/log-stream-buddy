import { Activity, Database, Zap, Users, Building2, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const organizations = [
  { id: "1", name: "Acme Corp", plan: "Enterprise", logo: "/api/placeholder/32/32" },
  { id: "2", name: "TechStart Inc", plan: "Pro", logo: "/api/placeholder/32/32" },
  { id: "3", name: "DevOps Solutions", plan: "Basic", logo: "/api/placeholder/32/32" }
];

export const Header = () => {
  const currentOrg = organizations[0]; // Mock current organization

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
            <p className="text-xs text-muted-foreground truncate">Organization Dashboard</p>
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
                      {currentOrg.name.substring(0, 2).toUpperCase()}
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
                      {org.name.substring(0, 2).toUpperCase()}
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
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 p-3 text-primary">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">Manage Organizations</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* System Status */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Card className="px-3 py-1.5 bg-gradient-surface">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-status-online rounded-full animate-pulse"></div>
            <span className="text-sm font-medium whitespace-nowrap">Online</span>
          </div>
        </Card>

        {/* Quick Stats - Hide on small screens */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <div className="text-right">
              <div className="text-sm font-bold">2.4M</div>
              <div className="text-xs text-muted-foreground">Logs</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <div className="text-right">
              <div className="text-sm font-bold">156/s</div>
              <div className="text-xs text-muted-foreground">Rate</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="text-right">
              <div className="text-sm font-bold">12</div>
              <div className="text-xs text-muted-foreground">Apps</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};