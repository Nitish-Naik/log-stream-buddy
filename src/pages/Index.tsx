import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { LogsTable } from "@/components/dashboard/LogsTable";
import { LiveStream } from "@/components/dashboard/LiveStream";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { Button } from "@/components/ui/button";

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
  const [isFilterOpen, setIsFilterOpen] = useState(true);
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
    <AppLayout>
      <div className="flex gap-4 p-6 w-full">
        {/* Filter Panel */}
        <FilterPanel 
          filters={filters} 
          onFiltersChange={setFilters}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
        />
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
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
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;