import Sidebar from "@/components/nav/Sidebar";
import BottomNav from "@/components/nav/BottomNav";
import TopBar from "@/components/nav/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Sidebar />
      <div className="lg:pl-60">
        <TopBar />
        <main className="pb-24 lg:pb-8">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}