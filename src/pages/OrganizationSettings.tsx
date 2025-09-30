import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Building2, Save, Upload, Bell, Shield, CreditCard, Key, AlertTriangle, Trash2, Mail, Clock, Database, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const OrganizationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Static organization data
  const organization = {
    name: "Your Organization",
    description: "A sample organization for log management",
    settings: {
      notificationsEnabled: true,
      alertsEnabled: true,
      retentionPeriod: "90",
      timezone: "America/New_York",
      errorRateThreshold: "5",
      responseTimeThreshold: "1000",
      dailyReportTime: "9:00",
      reportFormat: "pdf",
      twoFactorEnabled: false,
      ipRestrictionsEnabled: false,
    }
  };

  const organizationStats = {
    totalLogs: 2500000,
    avgIngestionRate: 150,
    activeMembers: 12,
    uptime: 99.9
  };

  const apiKeys = [
    {
      id: "1",
      name: "Production API",
      key: "logs_sk_prod_1234567890abcdef",
      createdAt: Date.now() - 86400000, // 1 day ago
      lastUsed: Date.now() - 3600000, // 1 hour ago
    }
  ];

  // Initialize form with static data
  const [orgName, setOrgName] = useState(organization.name);
  const [orgDescription, setOrgDescription] = useState(organization.description);
  const [notificationsEnabled, setNotificationsEnabled] = useState(organization.settings.notificationsEnabled);
  const [alertsEnabled, setAlertsEnabled] = useState(organization.settings.alertsEnabled);
  const [retentionPeriod, setRetentionPeriod] = useState(organization.settings.retentionPeriod);
  const [timezone, setTimezone] = useState(organization.settings.timezone);
  const [errorRateThreshold, setErrorRateThreshold] = useState(organization.settings.errorRateThreshold);
  const [responseTimeThreshold, setResponseTimeThreshold] = useState(organization.settings.responseTimeThreshold);
  const [dailyReportTime, setDailyReportTime] = useState(organization.settings.dailyReportTime);
  const [reportFormat, setReportFormat] = useState(organization.settings.reportFormat);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(organization.settings.twoFactorEnabled);
  const [ipRestrictionsEnabled, setIpRestrictionsEnabled] = useState(organization.settings.ipRestrictionsEnabled);
  const [newApiKeyName, setNewApiKeyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // Mock save - just show success message
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your organization settings have been updated successfully",
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleGenerateApiKey = async () => {
    if (!newApiKeyName.trim()) return;

    // Mock API key generation
    toast({
      title: "API key generated",
      description: "A new API key has been created for your organization",
    });

    setNewApiKeyName("");
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Organization Settings</h1>
            <p className="text-muted-foreground">Manage your organization's configuration and preferences</p>
          </div>
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="retention">Data Retention</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {/* Organization Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Organization Profile</CardTitle>
                <CardDescription>Basic information about your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/api/placeholder/80/80" />
                    <AvatarFallback className="text-lg">AC</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Label>Organization Logo</Label>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB. Recommended 400x400px.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plan">Current Plan</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Enterprise</Badge>
                      <Button variant="outline" size="sm">Upgrade</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orgDescription">Description</Label>
                  <Textarea
                    id="orgDescription"
                    value={orgDescription}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    placeholder="Describe your organization..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (UTC+1)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Organization Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>Current usage metrics for your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-surface rounded-lg">
                    <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{organizationStats?.totalLogs?.toLocaleString() || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Logs</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-surface rounded-lg">
                    <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{organizationStats?.avgIngestionRate || 0}/s</div>
                    <div className="text-sm text-muted-foreground">Avg. Ingestion Rate</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-surface rounded-lg">
                    <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{organizationStats?.activeMembers || 0}</div>
                    <div className="text-sm text-muted-foreground">Active Services</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-surface rounded-lg">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{organizationStats?.uptime || 0}%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Critical Alerts</div>
                    <div className="text-sm text-muted-foreground">Immediate notifications for critical issues</div>
                  </div>
                  <Switch
                    checked={alertsEnabled}
                    onCheckedChange={setAlertsEnabled}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Alert Thresholds</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Error Rate Threshold (%)</Label>
                      <Input
                        type="number"
                        value={errorRateThreshold}
                        onChange={(e) => setErrorRateThreshold(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Response Time Threshold (ms)</Label>
                      <Input
                        type="number"
                        value={responseTimeThreshold}
                        onChange={(e) => setResponseTimeThreshold(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Daily Report Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Delivery Time</Label>
                      <Select value={dailyReportTime} onValueChange={setDailyReportTime}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6:00">6:00 AM</SelectItem>
                          <SelectItem value="8:00">8:00 AM</SelectItem>
                          <SelectItem value="9:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Report Format</Label>
                      <Select value={reportFormat} onValueChange={setReportFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retention" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Retention Policy</CardTitle>
                <CardDescription>Configure how long log data is stored</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Log Retention Period (days)</Label>
                  <Select value={retentionPeriod} onValueChange={setRetentionPeriod}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Logs older than this period will be automatically deleted
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Storage Usage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-surface rounded-lg">
                      <div className="text-2xl font-bold">2.8 GB</div>
                      <div className="text-sm text-muted-foreground">Current Usage</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-surface rounded-lg">
                      <div className="text-2xl font-bold">50 GB</div>
                      <div className="text-sm text-muted-foreground">Plan Limit</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-surface rounded-lg">
                      <div className="text-2xl font-bold">5.6%</div>
                      <div className="text-sm text-muted-foreground">Usage Percentage</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    API Keys
                  </h3>
                  <div className="space-y-2">
                    {apiKeys?.map((apiKey: { id: string; name: string; key: string; createdAt: number; lastUsed?: number }) => (
                      <div key={apiKey.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-gradient-surface">
                        <div>
                          <div className="font-mono text-sm">logs_sk_••••••••••••{apiKey.key.slice(-4)}</div>
                          <div className="text-xs text-muted-foreground">
                            {apiKey.name} • Created {new Date(apiKey.createdAt).toLocaleDateString()} • Last used {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : "Never"}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Regenerate</Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="API Key name"
                        value={newApiKeyName}
                        onChange={(e) => setNewApiKeyName(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateApiKey}
                        disabled={!newApiKeyName.trim()}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Access Control
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-muted-foreground">Require 2FA for all team members</div>
                      </div>
                      <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={setTwoFactorEnabled}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">IP Restrictions</div>
                        <div className="text-sm text-muted-foreground">Allow access only from specific IP addresses</div>
                      </div>
                      <Switch
                        checked={ipRestrictionsEnabled}
                        onCheckedChange={setIpRestrictionsEnabled}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your subscription and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-gradient-surface">
                  <div>
                    <div className="font-semibold">Enterprise Plan</div>
                    <div className="text-sm text-muted-foreground">$99/month • Billed annually</div>
                  </div>
                  <Badge>Active</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-surface">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Usage This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2.4M</div>
                      <p className="text-sm text-muted-foreground">of 10M logs included</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-surface">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Next Billing Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Feb 15</div>
                      <p className="text-sm text-muted-foreground">$99.00 will be charged</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Payment Method</h3>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-gradient-surface">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="font-medium">•••• •••• •••• 4242</div>
                        <div className="text-sm text-muted-foreground">Expires 12/25</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrganizationSettings;