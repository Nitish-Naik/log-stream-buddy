import { Activity, Database, Zap, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Instant Dev Logs</h1>
            <p className="text-sm text-muted-foreground">Distributed Logging Dashboard</p>
          </div>
        </div>

        {/* System Status */}
        <div className="flex items-center gap-4">
          <Card className="px-4 py-2 bg-gradient-surface">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-status-online rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">System Online</span>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <div className="text-right">
                <div className="text-sm font-bold">2.4M</div>
                <div className="text-xs text-muted-foreground">Total Logs</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <div className="text-right">
                <div className="text-sm font-bold">156/s</div>
                <div className="text-xs text-muted-foreground">Ingestion Rate</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-right">
                <div className="text-sm font-bold">12</div>
                <div className="text-xs text-muted-foreground">Active Apps</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};