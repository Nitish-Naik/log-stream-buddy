import { ReactNode } from "react";
import { AppNavigation } from "@/components/navigation/AppNavigation";
import { Header } from "@/components/dashboard/Header";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
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

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};