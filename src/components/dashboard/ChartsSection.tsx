import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";
import { LogFilters } from "@/pages/Index";

interface ChartsSectionProps {
  filters: LogFilters;
}

// Sample data - in real app this would come from your API
const logsByLevel = [
  { level: "Error", count: 342, color: "#ef4444" },
  { level: "Warning", count: 1205, color: "#f59e0b" },
  { level: "Info", count: 4321, color: "#3b82f6" },
  { level: "Debug", count: 2876, color: "#6b7280" },
];

const logsOverTime = [
  { time: "00:00", error: 12, warning: 34, info: 145, debug: 98 },
  { time: "04:00", error: 8, warning: 28, info: 167, debug: 112 },
  { time: "08:00", error: 23, warning: 45, info: 234, debug: 145 },
  { time: "12:00", error: 45, warning: 67, info: 312, debug: 178 },
  { time: "16:00", error: 34, warning: 56, info: 287, debug: 156 },
  { time: "20:00", error: 28, warning: 41, info: 198, debug: 134 },
];

const appDistribution = [
  { name: "auth-service", value: 1234, color: "#10b981" },
  { name: "payment-service", value: 876, color: "#3b82f6" },
  { name: "user-service", value: 1456, color: "#f59e0b" },
  { name: "notification-service", value: 634, color: "#ef4444" },
  { name: "analytics-service", value: 456, color: "#8b5cf6" },
  { name: "email-service", value: 234, color: "#06b6d4" },
];

export const ChartsSection = ({ filters }: ChartsSectionProps) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-surface shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                <p className="text-2xl font-bold">8,744</p>
                <p className="text-xs text-log-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from yesterday
                </p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-surface shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-log-error">342</p>
                <p className="text-xs text-log-error">
                  +5 in last hour
                </p>
              </div>
              <div className="h-8 w-8 bg-log-error-bg rounded-lg flex items-center justify-center">
                <div className="h-4 w-4 bg-log-error rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-surface shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-log-warning">1,205</p>
                <p className="text-xs text-log-warning">
                  -2% from yesterday
                </p>
              </div>
              <div className="h-8 w-8 bg-log-warning-bg rounded-lg flex items-center justify-center">
                <div className="h-4 w-4 bg-log-warning rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-surface shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Apps</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-log-success">
                  All healthy
                </p>
              </div>
              <div className="h-8 w-8 bg-log-success-bg rounded-lg flex items-center justify-center">
                <div className="h-4 w-4 bg-log-success rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logs by Level Bar Chart */}
        <Card className="bg-gradient-surface shadow-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Logs by Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={logsByLevel}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="level" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="count" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* App Distribution Pie Chart */}
        <Card className="bg-gradient-surface shadow-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-primary" />
              Logs by Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Logs Over Time Line Chart */}
        <Card className="lg:col-span-2 bg-gradient-surface shadow-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Logs Over Time (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={logsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="error" 
                  stroke="hsl(var(--log-error))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--log-error))", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="warning" 
                  stroke="hsl(var(--log-warning))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--log-warning))", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="info" 
                  stroke="hsl(var(--log-info))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--log-info))", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="debug" 
                  stroke="hsl(var(--log-debug))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--log-debug))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};