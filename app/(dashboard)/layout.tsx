import { DashboardNav } from "@/components/layout/dashboard-nav";
import { AddSheetProvider } from "@/features/add/add-sheet-context";
import { Toaster } from "@/components/ui/sonner";
import { WarmupPing } from "@/components/warmup-ping";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AddSheetProvider>
      <WarmupPing />
      <div className="flex min-h-screen min-h-[100dvh] flex-col bg-background">
        <main className="flex-1 overflow-auto pb-24">
          {children}
        </main>
        <DashboardNav />
        <Toaster />
      </div>
    </AddSheetProvider>
  );
}
