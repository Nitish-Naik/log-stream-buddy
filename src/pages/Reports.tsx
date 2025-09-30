import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { CalendarIcon, Download, FileText, Mail, Calendar as CalendarLucide, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";

const Reports = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reportType, setReportType] = useState<string>("daily");
  const [dateRange, setDateRange] = useState<{from: Date | null, to: Date | null}>({
    from: subDays(new Date(), 7),
    to: new Date()
  });

  // Types for export data
  interface ExportData {
    [key: string]: string | number | boolean | null;
  }

  // Export functions
  const exportToCSV = (data: ExportData[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportDailyReport = (report: {id: string, date: string, status: string, totalLogs: number, errorCount: number, warningCount: number, criticalIssues: number, downloadUrl: string | null}) => {
    // Create a sample export with the report data
    const exportData: ExportData[] = [{
      date: report.date,
      totalLogs: report.totalLogs,
      errorCount: report.errorCount,
      warningCount: report.warningCount,
      criticalIssues: report.criticalIssues,
      status: report.status
    }];
    exportToCSV(exportData, `daily-report-${report.date}.csv`);
  };

  const exportWeeklySummary = () => {
    if (!weeklySummary) return;
    
    const summaryData: ExportData[] = [{
      period: 'Last 7 days',
      totalLogs: weeklySummary.totalLogs,
      totalErrors: weeklySummary.totalErrors,
      totalWarnings: weeklySummary.totalWarnings,
      errorRate: ((weeklySummary.totalErrors / (weeklySummary.totalLogs || 1)) * 100).toFixed(2),
      activeServices: weeklySummary.appCount,
      peakHour: weeklySummary.peakHour
    }];
    
    exportToCSV(summaryData, `weekly-summary-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportAnalyticsSummary = () => {
    if (!analyticsData) return;
    
    const summaryData: ExportData[] = [{
      period: `${analyticsData.summary.days} days`,
      totalLogs: analyticsData.summary.totalLogs,
      errorRate: analyticsData.summary.errorRate,
      totalErrors: analyticsData.summary.totalErrors,
      totalWarnings: analyticsData.summary.totalWarnings
    }];
    
    exportToCSV(summaryData, `analytics-summary-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportAnalyticsData = () => {
    if (!analyticsData) return;
    exportToCSV(analyticsData.trends as ExportData[], `analytics-trends-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportAllReports = () => {
    // Export all available data
    if (analyticsData) {
      exportAnalyticsData();
      setTimeout(() => exportAnalyticsSummary(), 1000);
    }
    if (weeklySummary) {
      setTimeout(() => exportWeeklySummary(), 2000);
    }
    if (dailyReports.length > 0) {
      setTimeout(() => {
        dailyReports.forEach((report, index) => {
          if (report.status === 'completed') {
            setTimeout(() => exportDailyReport(report), index * 500);
          }
        });
      }, 3000);
    }
  };

  // Fetch analytics data
  const analyticsData = useQuery(api.functions.logs.getAnalyticsData, 
    user ? { userId: user.userId, days: 7 } : "skip"
  );

  // Fetch weekly summary
  const weeklySummary = useQuery(api.functions.logs.getWeeklySummary,
    user ? { userId: user.userId } : "skip"
  );

  // Fetch logs for the selected date range
  const logsData = useQuery(api.functions.logs.getLogsByDateRange,
    user && dateRange.from && dateRange.to ? {
      userId: user.userId,
      startDate: startOfDay(dateRange.from).getTime(),
      endDate: endOfDay(dateRange.to).getTime(),
      limit: 1000
    } : "skip"
  );

  // Calculate today's stats from logs data
  const todayStats = useMemo(() => {
    if (!logsData) return null;

    const today = new Date();
    const todayLogs = logsData.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === today.toDateString();
    });

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayLogs = logsData.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === yesterday.toDateString();
    });

    const errorCount = todayLogs.filter(log => log.level === 'error').length;
    const warningCount = todayLogs.filter(log => log.level === 'warning').length;
    const criticalIssues = todayLogs.filter(log => 
      log.level === 'error' && log.message.toLowerCase().includes('critical')
    ).length;

    const todayTotal = todayLogs.length;
    const yesterdayTotal = yesterdayLogs.length;
    const changePercent = yesterdayTotal > 0 ? ((todayTotal - yesterdayTotal) / yesterdayTotal * 100) : 0;

    return {
      totalLogs: todayTotal,
      errorCount,
      warningCount,
      criticalIssues,
      changePercent
    };
  }, [logsData]);

  // Generate daily reports data
  const dailyReports = useMemo(() => {
    if (!logsData) return [];

    const reports = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayLogs = logsData.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === date.toDateString();
      });

      const errorCount = dayLogs.filter(log => log.level === 'error').length;
      const warningCount = dayLogs.filter(log => log.level === 'warning').length;
      const criticalIssues = dayLogs.filter(log => 
        log.level === 'error' && log.message.toLowerCase().includes('critical')
      ).length;

      reports.push({
        id: date.toISOString().split('T')[0],
        date: date.toISOString().split('T')[0],
        status: dayLogs.length > 0 ? "completed" : "pending",
        totalLogs: dayLogs.length,
        errorCount,
        warningCount,
        criticalIssues,
        downloadUrl: dayLogs.length > 0 ? "#" : null
      });
    }

    return reports;
  }, [logsData]);

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Daily reports, trends, and insights for your organization</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[200px] lg:w-[240px] justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from || new Date()}
                  selected={dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : undefined}
                  onSelect={(range) => setDateRange({ from: range?.from || null, to: range?.to || null })}
                  numberOfMonths={1}
                  className="max-w-[320px]"
                />
              </PopoverContent>
            </Popover>

            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => exportAllReports()} className="flex-1 sm:flex-none">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export All</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button className="flex-1 sm:flex-none">
                <Mail className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Email Schedule</span>
                <span className="sm:hidden">Email</span>
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily Reports</TabsTrigger>
            <TabsTrigger value="trends">Trends & Analytics</TabsTrigger>
            <TabsTrigger value="summary">Weekly Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            {/* Quick Stats */}
            {todayStats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-surface">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Logs</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{todayStats.totalLogs.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      {`${todayStats.changePercent >= 0 ? '+' : ''}${todayStats.changePercent.toFixed(1)}%`} from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-surface">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-log-error" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-log-error">
                      {((todayStats.errorCount / (todayStats.totalLogs || 1)) * 100).toFixed(2)}%
                    </div>
                    <p className="text-xs text-muted-foreground">{todayStats.errorCount} errors detected</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-surface">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                    <CheckCircle className="h-4 w-4 text-status-online" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-status-online">
                      {todayStats.errorCount === 0 ? "100.00" : 
                       (100 - ((todayStats.errorCount / (todayStats.totalLogs || 1)) * 100)).toFixed(2)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {todayStats.errorCount === 0 ? "All systems operational" : "Issues detected"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-surface">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{todayStats.criticalIssues}</div>
                    <p className="text-xs text-muted-foreground">Require attention</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="bg-gradient-surface">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Reports List */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Reports</CardTitle>
                <CardDescription>Download and view your daily log reports</CardDescription>
              </CardHeader>
              <CardContent>
                {dailyReports.length > 0 ? (
                  <div className="space-y-4">
                    {dailyReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-gradient-surface">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <CalendarLucide className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{format(new Date(report.date), "MMMM dd, yyyy")}</div>
                            <div className="text-sm text-muted-foreground">
                              {report.totalLogs.toLocaleString()} logs • {report.errorCount} errors • {report.warningCount} warnings
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={report.status === "completed" ? "secondary" : "outline"}>
                            {report.status === "completed" ? "Ready" : "Generating..."}
                          </Badge>
                          {report.status === "completed" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => exportDailyReport(report)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No reports available</h3>
                    <p className="text-sm text-muted-foreground">Reports will appear here once logs are generated for the selected date range.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {analyticsData ? (
              <>
                {/* Export Controls */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={exportAnalyticsData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Trends (CSV)
                  </Button>
                  <Button variant="outline" onClick={() => exportAnalyticsSummary()}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export Summary (CSV)
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Log Volume Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Log Volume Trend</CardTitle>
                    <CardDescription>Daily log counts over the past week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analyticsData.trends}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="logs" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Log Level Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Log Level Distribution</CardTitle>
                    <CardDescription>Breakdown by severity level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData.distribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData.distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(var(--log-${entry.name.toLowerCase()}))`} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Error Rate Trend */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Error & Warning Trends</CardTitle>
                    <CardDescription>Error and warning counts over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData.trends}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="errors" fill="hsl(var(--log-error))" name="Errors" />
                        <Bar dataKey="warnings" fill="hsl(var(--log-warning))" name="Warnings" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
            ) : (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading analytics data...</span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            {weeklySummary ? (
              <>
                {/* Export Controls */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => exportWeeklySummary()}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Summary (CSV)
                  </Button>
                </div>

                <Card>
                <CardHeader>
                  <CardTitle>Weekly Summary</CardTitle>
                  <CardDescription>Comprehensive overview of the past week's logging activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-surface rounded-lg">
                      <div className="text-2xl font-bold text-primary">{weeklySummary.totalLogs.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Logs This Week</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-surface rounded-lg">
                      <div className="text-2xl font-bold text-log-error">{weeklySummary.totalErrors.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Errors</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-surface rounded-lg">
                      <div className="text-2xl font-bold text-log-warning">{weeklySummary.totalWarnings.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Warnings</div>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <h3>Key Insights</h3>
                    <ul>
                      <li>Peak logging hour: {weeklySummary.peakHour}</li>
                      <li>Active services: {weeklySummary.appCount} applications</li>
                      {weeklySummary.topApps.length > 0 && (
                        <li>Top service: {weeklySummary.topApps[0].app} ({weeklySummary.topApps[0].total} logs)</li>
                      )}
                      <li>Error rate: {((weeklySummary.totalErrors / (weeklySummary.totalLogs || 1)) * 100).toFixed(2)}%</li>
                      <li>Most active period: Based on log distribution patterns</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
            ) : (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading weekly summary...</span>
              </div>
            )}
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;