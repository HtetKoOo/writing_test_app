import React from "react";
import { MetricCards } from "@/components/admin/metric-cards";
import { ChartsSection } from "@/components/admin/charts-section";
import { DataListsSection } from "@/components/admin/data-lists";
import { RecentAuditsSection } from "@/components/admin/recent-audits";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationDropdown } from "@/components/notification-dropdown";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614]">
        <div className="flex items-center gap-12">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Dashboard</h1>
            <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
              <span>Admin</span>
              <span>›</span>
              <span className="text-zinc-400">Overview</span>
            </div>
          </div>
          
          <div className="relative hidden md:block w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input 
              placeholder="Search by email, user ID, or act" 
              className="pl-9 bg-[#1a211e] border-white/10 text-sm h-9 focus-visible:ring-1 focus-visible:ring-[var(--sage)] placeholder:text-zinc-600 rounded-md text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationDropdown />
          <Avatar className="size-9 border-2 border-[var(--gold)]/30 rounded-full">
            <AvatarImage src="" />
            <AvatarFallback className="bg-white text-black font-bold text-xs">AD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-4">
          <MetricCards />
          <ChartsSection />
          <DataListsSection />
          <RecentAuditsSection />
        </div>
      </main>
    </div>
  );
}
