import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { LogFilters } from "@/pages/Index";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterPanelProps {
  filters: LogFilters;
  onFiltersChange: (filters: LogFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const logLevels = [
  { value: "error", label: "Error", color: "log-error" },
  { value: "warning", label: "Warning", color: "log-warning" },
  { value: "info", label: "Info", color: "log-info" },
  { value: "debug", label: "Debug", color: "log-debug" },
];

const sampleApps = [
  "auth-service",
  "payment-service",
  "user-service",
  "notification-service",
  "analytics-service",
  "email-service",
];

export const FilterPanel = ({ filters, onFiltersChange, isOpen, onToggle }: FilterPanelProps) => {
  const updateFilters = (updates: Partial<LogFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({
      level: [],
      appName: [],
      search: "",
      timeRange: { from: null, to: null },
    });
  };

  const hasActiveFilters = 
    filters.level.length > 0 || 
    filters.appName.length > 0 || 
    filters.search.length > 0 ||
    filters.timeRange.from || 
    filters.timeRange.to;

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="mb-4"
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {isOpen ? "" : ""}
        {/* {isOpen ? "Hide Filters" : "Show Filters"} */}
      </Button>

      {/* Filter Panel */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "w-80 opacity-100" : "w-0 opacity-0"
        )}
      >
        <Card className="h-full border-r">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Search */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search in messages..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Log Levels */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Log Levels</Label>
                <Card className="p-3 bg-gradient-surface">
                  <div className="space-y-3">
                    {logLevels.map((level) => (
                      <div key={level.value} className="flex items-center space-x-3">
                        <Checkbox
                          id={level.value}
                          checked={filters.level.includes(level.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFilters({ level: [...filters.level, level.value] });
                            } else {
                              updateFilters({ level: filters.level.filter(l => l !== level.value) });
                            }
                          }}
                        />
                        <Label 
                          htmlFor={level.value} 
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <div 
                            className={cn("h-2 w-2 rounded-full", `bg-${level.color}`)}
                          />
                          {level.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Applications */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Applications</Label>
                <Card className="p-3 bg-gradient-surface">
                  <ScrollArea className="h-48">
                    <div className="space-y-3 pr-4">
                      {sampleApps.map((app) => (
                        <div key={app} className="flex items-center space-x-3">
                          <Checkbox
                            id={app}
                            checked={filters.appName.includes(app)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFilters({ appName: [...filters.appName, app] });
                              } else {
                                updateFilters({ appName: filters.appName.filter(a => a !== app) });
                              }
                            }}
                          />
                          <Label htmlFor={app} className="cursor-pointer font-mono text-sm">
                            {app}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>

              {/* Time Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Time Range</Label>
                <Card className="p-3 bg-gradient-surface">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">From</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.timeRange.from ? (
                              format(filters.timeRange.from, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-50 bg-popover" align="start">
                          <Calendar
                            mode="single"
                            selected={filters.timeRange.from || undefined}
                            onSelect={(date) => 
                              updateFilters({ 
                                timeRange: { ...filters.timeRange, from: date || null } 
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">To</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.timeRange.to ? (
                              format(filters.timeRange.to, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-50 bg-popover" align="start">
                          <Calendar
                            mode="single"
                            selected={filters.timeRange.to || undefined}
                            onSelect={(date) => 
                              updateFilters({ 
                                timeRange: { ...filters.timeRange, to: date || null } 
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </>
  );
};
