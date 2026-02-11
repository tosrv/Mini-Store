import { MobileBottomBar } from "@/components/dashboard/MobileBottomBar";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">{children}</div>

      <MobileBottomBar />
    </main>
  );
}
