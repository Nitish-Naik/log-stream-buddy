import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LogLevelBadgeProps {
  level: "error" | "warning" | "info" | "debug";
  size?: "sm" | "default";
}

const levelConfig = {
  error: {
    label: "ERROR",
    className: "bg-log-error-bg text-log-error border-log-error/20",
  },
  warning: {
    label: "WARN", 
    className: "bg-log-warning-bg text-log-warning border-log-warning/20",
  },
  info: {
    label: "INFO",
    className: "bg-log-info-bg text-log-info border-log-info/20",
  },
  debug: {
    label: "DEBUG",
    className: "bg-log-debug-bg text-log-debug border-log-debug/20",
  },
};

export const LogLevelBadge = ({ level, size = "default" }: LogLevelBadgeProps) => {
  const config = levelConfig[level];
  
  return (
    <Badge 
      variant="outline"
      className={cn(
        "font-mono font-bold border",
        config.className,
        size === "sm" ? "text-xs px-1.5 py-0.5" : "text-xs px-2 py-1"
      )}
    >
      {config.label}
    </Badge>
  );
};