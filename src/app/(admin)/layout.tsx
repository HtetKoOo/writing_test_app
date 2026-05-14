import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AuthProvider } from "@/components/auth-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Force dark mode context for the admin dashboard as requested by the design
    <div className="dark">
      <SidebarProvider className="min-h-screen bg-[#111614] text-zinc-100">
        <AdminSidebar />
        <SidebarInset className="bg-[#111614] border-l border-white/5 overflow-hidden">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
