import { useState } from "react";
import { AppNavigation } from "@/components/navigation/AppNavigation";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { LogsTable } from "@/components/dashboard/LogsTable";
import { LiveStream } from "@/components/dashboard/LiveStream";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Header } from "@/components/dashboard/Header";

export interface LogFilters {
  level: string[];
  appName: string[];
  search: string;
  timeRange: {
    from: Date | null;
    to: Date | null;
  };
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<"table" | "live">("table");
  const [filters, setFilters] = useState<LogFilters>({
    level: [],
    appName: [],
    search: "",
    timeRange: {
      from: null,
      to: null,
    },
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        {/* Navigation Sidebar */}
        <AppNavigation />

        {/* Main Content */}
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="h-16 flex items-center border-b border-border bg-card px-4 sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            <Header />
          </header>

          <main className="p-6">
            {/* Charts Section */}
            <ChartsSection filters={filters} />

            {/* Tab Navigation */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant={activeTab === "table" ? "default" : "ghost"}
                onClick={() => setActiveTab("table")}
              >
                Logs Table
              </Button>
              <Button
                variant={activeTab === "live" ? "default" : "ghost"}
                onClick={() => setActiveTab("live")}
              >
                Live Stream
              </Button>
            </div>

            {/* Content Tabs */}
            {activeTab === "table" && <LogsTable filters={filters} />}
            {activeTab === "live" && <LiveStream />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;