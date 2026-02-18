import { BottomNav } from "@/components/layout/bottom-nav";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 overflow-auto pb-24">
        {children}
      </main>
      <BottomNav />
      <Toaster />
    </div>
  );
}
