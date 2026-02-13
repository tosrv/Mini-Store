import { MobileBottomBar } from "@/components/dashboard/MobileBottomBar";
import Sidebar from "@/components/dashboard/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user.id;
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (!session || data?.role === "customer") {
    redirect("/");
  }

  return (
    <main className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">{children}</div>

      <MobileBottomBar />
    </main>
  );
}
