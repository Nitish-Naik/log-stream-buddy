import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Play,
  Pause,
  Square,
  Trash2,
  Radio,
  ScrollText,
  Zap,
  Users
} from "lucide-react";
import { LogLevelBadge } from "@/components/dashboard/LogLevelBadge";
import { format } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";

interface StreamLog {
  id: string;
  timestamp: Date;
  level: "error" | "warning" | "info" | "debug";
  message: string;
  app_name: string;
  meta?: { [key: string]: unknown };
}

interface LiveStreamProps {
  isStreaming?: boolean;
  onStreamingChange?: (streaming: boolean) => void;
  messageCount?: number;
  onMessageCountChange?: (count: number) => void;
}

export const LiveStream = ({ 
  isStreaming: externalIsStreaming, 
  onStreamingChange,
  messageCount: externalMessageCount,
  onMessageCountChange
}: LiveStreamProps) => {
  const { user } = useAuth();
  const [internalIsStreaming, setInternalIsStreaming] = useState(false);
  const [internalMessageCount, setInternalMessageCount] = useState(0);
  const [logs, setLogs] = useState<StreamLog[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [connectedClients] = useState(3);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use external state if provided, otherwise use internal state
  const isStreaming = externalIsStreaming !== undefined ? externalIsStreaming : internalIsStreaming;
  const setIsStreaming = onStreamingChange || setInternalIsStreaming;
  const messageCount = externalMessageCount !== undefined ? externalMessageCount : internalMessageCount;
  const setMessageCount = onMessageCountChange || setInternalMessageCount;

  // Convex hooks
  const storeLog = useMutation(api.functions.logs.storeLog);
  const clearUserLogs = useMutation(api.functions.logs.clearUserLogs);
  const storedLogs = useQuery(api.functions.logs.getLogs, user ? { userId: user.userId, limit: 100000 } : "skip");

  // Load stored logs when component mounts or user changes
  useEffect(() => {
    if (storedLogs && user) {
      const formattedLogs: StreamLog[] = storedLogs.map(log => ({
        id: log._id,
        timestamp: new Date(log.timestamp),
        level: log.level,
        message: log.message,
        app_name: log.app_name,
        meta: log.meta,
      }));
      setLogs(formattedLogs);
      setMessageCount(formattedLogs.length);
    }
  }, [storedLogs, user, setMessageCount]);

  // Simulate real-time log streaming and store in database
  useEffect(() => {
    if (!isStreaming || !user) return;

    const sampleMessages = [
      { level: "info", message: "User session started", app: "auth-service" },
      { level: "debug", message: "Cache hit for user preferences", app: "user-service" },
      { level: "warning", message: "Rate limit approaching for API key", app: "api-gateway" },
      { level: "error", message: "Payment processing failed", app: "payment-service" },
      { level: "info", message: "Email queued for delivery", app: "notification-service" },
      { level: "debug", message: "Database query executed", app: "analytics-service" },
    ];

    const interval = setInterval(async () => {
      const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      const timestamp = Date.now();

      // Store log in database
      try {
        await storeLog({
          timestamp,
          level: randomMessage.level as StreamLog["level"],
          message: randomMessage.message,
          app_name: randomMessage.app,
          userId: user.userId,
          organization: user.organization,
          meta: {
            sessionId: `sess_${Math.random().toString(36).substr(2, 9)}`,
            requestId: `req_${Math.random().toString(36).substr(2, 9)}`
          }
        });
      } catch (error) {
        console.error("Failed to store log:", error);
      }

      // Update local state for immediate UI feedback
      const newLog: StreamLog = {
        id: `stream_${timestamp}_${Math.random()}`,
        timestamp: new Date(timestamp),
        level: randomMessage.level as StreamLog["level"],
        message: randomMessage.message,
        app_name: randomMessage.app,
        meta: {
          sessionId: `sess_${Math.random().toString(36).substr(2, 9)}`,
          requestId: `req_${Math.random().toString(36).substr(2, 9)}`
        }
      };

      setLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep last 100 logs
      setMessageCount(messageCount + 1);
    }, Math.random() * 2000 + 500); // Random interval between 500ms - 2.5s

    return () => clearInterval(interval);
  }, [isStreaming, user, storeLog, messageCount, setMessageCount]);

  // Load stored logs on component mount and when storedLogs changes
  useEffect(() => {
    if (storedLogs && storedLogs.length > 0) {
      const formattedLogs: StreamLog[] = storedLogs.map(log => ({
        id: log._id,
        timestamp: new Date(log.timestamp),
        level: log.level as StreamLog["level"],
        message: log.message,
        app_name: log.app_name,
        meta: log.meta
      }));
      setLogs(formattedLogs);
    } else if (storedLogs && storedLogs.length === 0) {
      setLogs([]);
    }
  }, [storedLogs]);

  const handleStart = () => {
    if (!user) {
      alert("Please log in to start streaming logs");
      return;
    }
    setIsStreaming(true);
  };

  const handlePause = () => {
    setIsStreaming(false);
  };

  const handleStop = () => {
    setIsStreaming(false);
    setLogs([]);
  };

  const handleClear = async () => {
    if (!user) return;
    try {
      await clearUserLogs({ userId: user.userId });
      setIsStreaming(false);
      setLogs([]);
      setMessageCount(0);
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Stream Controls */}
      <Card className="bg-gradient-surface shadow-soft">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Radio className={`h-5 w-5 ${isStreaming ? 'text-log-success animate-pulse' : 'text-muted-foreground'}`} />
              Live Stream
              {isStreaming && (
                <Badge variant="secondary" className="bg-log-success-bg text-log-success">
                  LIVE
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex items-center gap-4">
              {/* Stream Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  {messageCount} messages
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {connectedClients} clients
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-scroll"
                    checked={autoScroll}
                    onCheckedChange={setAutoScroll}
                  />
                  <Label htmlFor="auto-scroll" className="text-sm">Auto-scroll</Label>
                </div>

                <div className="flex items-center gap-1">
                  {!isStreaming ? (
                    <Button variant="default" size="sm" onClick={handleStart}>
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={handlePause}>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm" onClick={handleStop}>
                    <Square className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={handleClear}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Live Stream Console */}
      <Card className="bg-gradient-surface shadow-elevated">
        <CardContent className="p-0">
          <div 
            ref={scrollRef}
            className="h-[600px] overflow-y-auto bg-card font-mono text-sm"
          >
            {logs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <ScrollText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No logs streaming</p>
                  <p className="text-xs">Click "Start" to begin live streaming</p>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {logs.map((log, index) => (
                  <div 
                    key={log.id}
                    className={`px-4 py-2 border-b border-border/30 hover:bg-muted/30 transition-colors ${
                      index === 0 && isStreaming ? 'bg-log-success-bg animate-pulse' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(log.timestamp, "HH:mm:ss.SSS")}
                      </div>
                      
                      <LogLevelBadge level={log.level} size="sm" />
                      
                      <Badge variant="outline" className="text-xs font-mono">
                        {log.app_name}
                      </Badge>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-foreground">{log.message}</div>
                        {log.meta && (
                          <div className="text-xs text-muted-foreground mt-1 space-x-2">
                            {Object.entries(log.meta).map(([key, value], i) => (
                              <span key={i} className="inline-block">
                                <span className="text-log-info">{key}:</span>
                                <span className="ml-1">{String(value)}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stream Footer */}
      {isStreaming && (
        <Card className="bg-log-success-bg border-log-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-log-success">
                <div className="h-2 w-2 bg-log-success rounded-full animate-pulse" />
                Stream is active - logs will appear in real-time
              </div>
              <div className="text-muted-foreground">
                WebSocket connection established
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};