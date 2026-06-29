import React from "react";
import { MetricCards } from "@/components/admin/metric-cards";
import { ChartsSection } from "@/components/admin/charts-section";
import { DataListsSection } from "@/components/admin/data-lists";
import { RecentAuditsSection } from "@/components/admin/recent-audits";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DashboardHeader } from "@/components/dashboard-header";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <DashboardHeader
        title="Dashboard"
        breadcrumbs={[
          { label: "Admin" },
          { label: "Overview" }
        ]}
        leftContent={
          <div className="relative hidden md:block w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input 
              placeholder="Search by email, user ID, or act" 
              className="pl-9 bg-[#1a211e] border-white/10 text-sm h-9 focus-visible:ring-1 focus-visible:ring-[var(--sage)] placeholder:text-zinc-600 rounded-md text-white"
            />
          </div>
        }
      />

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
