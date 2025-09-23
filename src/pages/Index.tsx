import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { LogsTable } from "@/components/dashboard/LogsTable";
import { LiveStream } from "@/components/dashboard/LiveStream";
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
      <div className="p-6">
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
    </AppLayout>
  );
};

export default Index;