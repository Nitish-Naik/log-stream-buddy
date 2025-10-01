

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  BarChart3,
  Shield,
  Users,
  Zap,
  Database,
  TrendingUp,
  FileText,
  Settings,
  Play,
  Github,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Monitor,
  Filter,
  Download,
  Brain
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Activity,
      title: "Real-Time Log Streaming",
      description: "Monitor your applications in real-time with live log streaming and instant notifications.",
      color: "text-blue-500"
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Leverage GPT-4 for intelligent log analysis, anomaly detection, and automated insights.",
      color: "text-purple-500"
    },
    {
      icon: BarChart3,
      title: "Interactive Dashboard",
      description: "Beautiful charts and visualizations for log trends, error rates, and system health.",
      color: "text-green-500"
    },
    {
      icon: FileText,
      title: "Advanced Reports",
      description: "Generate comprehensive reports with analytics, trends, and export capabilities.",
      color: "text-orange-500"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Collaborate with your team with role-based access and organization management.",
      color: "text-indigo-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Secure authentication, organization isolation, and data protection.",
      color: "text-red-500"
    },
    {
      icon: Filter,
      title: "Smart Filtering",
      description: "Advanced filtering by log level, time range, application, and custom queries.",
      color: "text-cyan-500"
    },
    {
      icon: Download,
      title: "Export & Integration",
      description: "Export logs to CSV, integrate with monitoring tools, and API access.",
      color: "text-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 lg:px-10 py-4 bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="font-extrabold text-xl text-foreground">Instant Dev Logs</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => window.open('https://github.com/Nitish-Naik/log-stream-buddy', '_blank')}
            className="hidden sm:flex"
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500"
          >
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Next-Gen Log Management</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> Application Logs </span>
              Into Actionable Insights
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Monitor, analyze, and optimize your applications with real-time log streaming,
              AI-powered insights, and beautiful dashboards. Built for modern development teams.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/signup")}
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Monitoring Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open('https://drive.google.com/file/d/16WR0VT_63Q3gWilDhnHaP6-mRcxDcSQf/view?usp=sharing', '_blank')}
                className="px-8 py-3 text-lg font-semibold border-2 hover:bg-muted/50"
              >
                <Play className="h-5 w-5 mr-2" />
                View Demo Video
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Enterprise ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Log Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From real-time monitoring to AI-driven insights, we've built the complete log management solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-200 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the power of modern log management with our interactive demo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Real-Time Dashboard</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Monitor your applications with live charts, error tracking, and performance metrics.
                  Get instant notifications and automated insights.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">AI-Powered Analysis</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Ask natural language questions about your logs. Get summaries, detect anomalies,
                  and receive actionable recommendations powered by GPT-4.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="px-3 py-1">
                  <Monitor className="h-3 w-3 mr-1" />
                  Live Streaming
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Analytics
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Zap className="h-3 w-3 mr-1" />
                  Real-Time
                </Badge>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-card to-muted/50 border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Live Dashboard Preview
                </CardTitle>
                <CardDescription>
                  Experience the full power of Instant Dev Logs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">System Status</span>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">1,247</div>
                      <div className="text-xs text-muted-foreground">Total Logs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-500">23</div>
                      <div className="text-xs text-muted-foreground">Errors</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-500">45</div>
                      <div className="text-xs text-muted-foreground">Warnings</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Recent Activity</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>API Gateway: Request processed successfully</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      <span>Payment Service: Rate limit approaching</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      <span>Auth Service: Failed login attempt</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Ready to Transform Your Log Management?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of developers who trust Instant Dev Logs for their application monitoring needs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open('https://github.com/Nitish-Naik/log-stream-buddy', '_blank')}
              className="px-8 py-3 text-lg font-semibold border-2 hover:bg-muted/50"
            >
              <Github className="h-5 w-5 mr-2" />
              View on GitHub
            </Button>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-muted-foreground mb-4">Built with modern technologies</p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Convex Backend</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>OpenAI GPT-4</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Recharts</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>TypeScript</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-foreground">Instant Dev Logs</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© 2025 Instant Dev Logs. All rights reserved.</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://github.com/Nitish-Naik/log-stream-buddy', '_blank')}
              >
                <Github className="h-4 w-4 mr-1" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
