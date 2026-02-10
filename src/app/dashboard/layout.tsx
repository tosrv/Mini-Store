import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={cn("min-h-screen w-full bg-white text-black flex")}>
      <div className="p-8 w-full">{children}</div>
    </main>
  );
}
