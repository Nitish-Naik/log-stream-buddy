import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { CalendarIcon, Download, FileText, Mail, Calendar as CalendarLucide, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const dailyReports = [
  {
    id: "1",
    date: "2024-01-15",
    status: "completed",
    totalLogs: 45678,
    errorCount: 123,
    warningCount: 456,
    criticalIssues: 2,
    downloadUrl: "#"
  },
  {
    id: "2", 
    date: "2024-01-14",
    status: "completed",
    totalLogs: 43210,
    errorCount: 89,
    warningCount: 234,
    criticalIssues: 1,
    downloadUrl: "#"
  },
  {
    id: "3",
    date: "2024-01-13", 
    status: "generating",
    totalLogs: 0,
    errorCount: 0,
    warningCount: 0,
    criticalIssues: 0,
    downloadUrl: null
  }
];

const weeklyTrends = [
  { date: "Jan 08", logs: 42000, errors: 95, warnings: 280 },
  { date: "Jan 09", logs: 41500, errors: 78, warnings: 190 },
  { date: "Jan 10", logs: 43200, errors: 156, warnings: 340 },
  { date: "Jan 11", logs: 44100, errors: 134, warnings: 287 },
  { date: "Jan 12", logs: 43800, errors: 98, warnings: 245 },
  { date: "Jan 13", logs: 45200, errors: 167, warnings: 398 },
  { date: "Jan 14", logs: 43210, errors: 89, warnings: 234 }
];

const logLevelDistribution = [
  { name: 'Info', value: 78, color: 'hsl(var(--log-info))' },
  { name: 'Warning', value: 15, color: 'hsl(var(--log-warning))' },
  { name: 'Error', value: 5, color: 'hsl(var(--log-error))' },
  { name: 'Debug', value: 2, color: 'hsl(var(--log-debug))' }
];

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reportType, setReportType] = useState<string>("daily");

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Daily reports, trends, and insights for your organization</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Mail className="h-4 w-4 mr-2" />
              Email Schedule
            </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-surface">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Logs</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45,678</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +5.2% from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-surface">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-log-error" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-log-error">0.27%</div>
                  <p className="text-xs text-muted-foreground">123 errors detected</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-surface">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                  <CheckCircle className="h-4 w-4 text-status-online" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-status-online">99.95%</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-surface">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">2</div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Reports List */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Reports</CardTitle>
                <CardDescription>Download and view your daily log reports</CardDescription>
              </CardHeader>
              <CardContent>
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
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Log Volume Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Log Volume Trend</CardTitle>
                  <CardDescription>Daily log counts over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyTrends}>
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
                        data={logLevelDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {logLevelDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
                    <BarChart data={weeklyTrends}>
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
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
                <CardDescription>Comprehensive overview of the past week's logging activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-surface rounded-lg">
                    <div className="text-2xl font-bold text-primary">301,570</div>
                    <div className="text-sm text-muted-foreground">Total Logs This Week</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-surface rounded-lg">
                    <div className="text-2xl font-bold text-log-error">807</div>
                    <div className="text-sm text-muted-foreground">Total Errors</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-surface rounded-lg">
                    <div className="text-2xl font-bold text-log-warning">2,174</div>
                    <div className="text-sm text-muted-foreground">Total Warnings</div>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <h3>Key Insights</h3>
                  <ul>
                    <li>Log volume increased by 8.3% compared to previous week</li>
                    <li>Error rate decreased by 2.1%, showing improved system stability</li>
                    <li>Peak logging hours: 9 AM - 11 AM and 2 PM - 4 PM</li>
                    <li>Most active services: auth-service (34%), payment-service (28%)</li>
                    <li>2 critical issues resolved, average resolution time: 14 minutes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Reports;