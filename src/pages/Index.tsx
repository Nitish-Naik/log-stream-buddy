import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { FilterSidebar } from "@/components/dashboard/FilterSidebar";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { LogsTable } from "@/components/dashboard/LogsTable";
import { LiveStream } from "@/components/dashboard/LiveStream";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        {/* Sidebar Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-20 left-4 z-50 bg-card shadow-soft border border-border"
        >
          {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>

        {/* Filter Sidebar */}
        <FilterSidebar 
          open={sidebarOpen} 
          filters={filters} 
          onFiltersChange={setFilters}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'} p-6`}>
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
      </div>
    </div>
  );
};

export default Index;