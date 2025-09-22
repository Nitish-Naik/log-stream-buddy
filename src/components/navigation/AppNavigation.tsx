import { NavLink, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar 
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Settings, 
  FileBarChart,
  Activity,
  Bell,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview and live logs"
  },
  {
    title: "Reports",
    href: "/reports", 
    icon: FileBarChart,
    description: "Daily reports and analytics"
  },
  {
    title: "Team",
    href: "/team",
    icon: Users, 
    description: "Team management"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Organization settings"
  }
];

export const AppNavigation = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  
  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent className="bg-card border-0">
        {!isCollapsed && (
          <>
            <SidebarGroup>
              <div className="flex items-center gap-3 p-4">
                <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <Activity className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Instant Dev Logs</h2>
                  <p className="text-xs text-muted-foreground">Dashboard</p>
                </div>
              </div>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)}>
                        <NavLink 
                          to={item.href}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                              isActive 
                                ? "bg-primary text-primary-foreground" 
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )
                          }
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Logs</span>
                    <span className="font-medium">2.4M</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Error Rate</span>
                    <span className="font-medium text-log-error">0.27%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-medium text-status-online">99.95%</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
        
        {isCollapsed && (
          <div className="flex flex-col items-center py-4 space-y-4">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            {navigationItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "p-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )
                }
                title={item.title}
              >
                <item.icon className="h-5 w-5" />
              </NavLink>
            ))}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};