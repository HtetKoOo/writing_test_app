import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TeacherSidebar } from "@/components/teacher-sidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Force dark mode context for the teacher dashboard
    <div className="dark">
      <SidebarProvider className="min-h-screen bg-[#111614] text-zinc-100">
        <TeacherSidebar />
        <SidebarInset className="bg-[#111614] border-l border-white/5 overflow-hidden">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
