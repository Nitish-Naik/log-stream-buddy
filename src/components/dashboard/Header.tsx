import { Activity, Database, Zap, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  return (
    <div className="flex items-center justify-between flex-1 min-w-0">
      {/* Logo and Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow flex-shrink-0">
          <Activity className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-foreground truncate">Instant Dev Logs</h1>
          <p className="text-xs text-muted-foreground truncate">Distributed Logging Dashboard</p>
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