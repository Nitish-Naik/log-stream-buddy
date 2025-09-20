import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  RefreshCw,
  Eye,
  Search,
  Calendar
} from "lucide-react";
import { LogFilters } from "@/pages/Index";
import { LogLevelBadge } from "@/components/dashboard/LogLevelBadge";
import { format } from "date-fns";

interface LogsTableProps {
  filters: LogFilters;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  level: "error" | "warning" | "info" | "debug";
  message: string;
  app_name: string;
  meta?: Record<string, any>;
}

// Sample data - in real app this would come from your API
const sampleLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: new Date("2025-09-20T10:30:45Z"),
    level: "error",
    message: "Failed to connect to database: connection timeout after 30s",
    app_name: "payment-service",
    meta: { retryCount: 3, connectionPool: "primary" }
  },
  {
    id: "2", 
    timestamp: new Date("2025-09-20T10:30:42Z"),
    level: "warning",
    message: "High memory usage detected: 85% of allocated heap",
    app_name: "user-service",
    meta: { memoryUsage: "850MB", heapSize: "1GB" }
  },
  {
    id: "3",
    timestamp: new Date("2025-09-20T10:30:40Z"),
    level: "info",
    message: "User authentication successful",
    app_name: "auth-service", 
    meta: { userId: "user_123", sessionId: "sess_abc" }
  },
  {
    id: "4",
    timestamp: new Date("2025-09-20T10:30:38Z"),
    level: "debug",
    message: "Processing webhook payload from Stripe",
    app_name: "payment-service",
    meta: { eventType: "payment.succeeded", customerId: "cus_123" }
  },
  {
    id: "5",
    timestamp: new Date("2025-09-20T10:30:35Z"),
    level: "error",
    message: "Email delivery failed: SMTP server unreachable",
    app_name: "notification-service",
    meta: { recipient: "user@example.com", templateId: "welcome" }
  },
  {
    id: "6",
    timestamp: new Date("2025-09-20T10:30:32Z"),
    level: "info",
    message: "Cache miss for user profile, fetching from database",
    app_name: "user-service",
    meta: { cacheKey: "profile_user_123", ttl: 3600 }
  }
];

export const LogsTable = ({ filters }: LogsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleExport = () => {
    // In real app, this would trigger CSV/JSON export
    console.log("Exporting logs...");
  };

  // Filter logs based on current filters
  const filteredLogs = sampleLogs.filter(log => {
    if (filters.level.length > 0 && !filters.level.includes(log.level)) return false;
    if (filters.appName.length > 0 && !filters.appName.includes(log.app_name)) return false;
    if (filters.search && !log.message.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <Card className="bg-gradient-surface shadow-soft">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Logs ({filteredLogs.length.toLocaleString()})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Logs Table */}
      <Card className="bg-gradient-surface shadow-elevated">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="w-[140px]">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Timestamp
                  </div>
                </TableHead>
                <TableHead className="w-[80px]">Level</TableHead>
                <TableHead className="w-[140px]">Application</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow key={log.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {format(log.timestamp, "HH:mm:ss.SSS")}
                    <div className="text-xs opacity-60">
                      {format(log.timestamp, "MMM dd")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <LogLevelBadge level={log.level} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {log.app_name}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="font-mono text-sm truncate" title={log.message}>
                      {log.message}
                    </div>
                    {log.meta && Object.keys(log.meta).length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {Object.entries(log.meta).slice(0, 2).map(([key, value], index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {key}: {String(value).substring(0, 10)}
                            {String(value).length > 10 && "..."}
                          </Badge>
                        ))}
                        {Object.keys(log.meta).length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{Object.keys(log.meta).length - 2} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredLogs.length)} of{" "}
              {filteredLogs.length} logs
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};