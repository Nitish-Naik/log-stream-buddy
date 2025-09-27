import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogLevelBadge } from "@/components/dashboard/LogLevelBadge";
import { format } from "date-fns";
import { Clock, Database, Code, Info } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: Date;
  level: "error" | "warning" | "info" | "debug";
  message: string;
  app_name: string;
  meta?: Record<string, any>;
}

interface LogDetailModalProps {
  log: LogEntry | null;
  open: boolean;
  onClose: () => void;
}

export const LogDetailModal = ({ log, open, onClose }: LogDetailModalProps) => {
  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gradient-surface">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Info className="h-5 w-5 text-primary" />
            Log Details
            <LogLevelBadge level={log.level} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="bg-card shadow-soft">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                  <p className="font-mono text-sm">
                    {format(log.timestamp, "PPpp")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Application</label>
                  <Badge variant="secondary" className="font-mono">
                    {log.app_name}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Log ID</label>
                <p className="font-mono text-xs text-muted-foreground">{log.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          <Card className="bg-card shadow-soft">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Code className="h-4 w-4" />
                Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap break-words font-mono">
                  {log.message}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          {log.meta && Object.keys(log.meta).length > 0 && (
            <Card className="bg-card shadow-soft">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Metadata
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {JSON.stringify(log.meta, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Context Information */}
          <Card className="bg-card shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Additional Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Severity Level:</span>
                    <LogLevelBadge level={log.level} size="sm" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source Application:</span>
                    <Badge variant="outline" className="text-xs">
                      {log.app_name}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timestamp (UTC):</span>
                    <span className="font-mono text-xs">
                      {format(log.timestamp, "yyyy-MM-dd HH:mm:ss.SSS")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Ago:</span>
                    <span className="text-xs">
                      {Math.round((Date.now() - log.timestamp.getTime()) / 1000)} seconds ago
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};