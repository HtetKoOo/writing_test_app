import React from "react";
import { TeacherMetricCards } from "@/components/teacher/teacher-metric-cards";
import { StudentList } from "@/components/teacher/student-list";
import { ReviewQueue } from "@/components/teacher/review-queue";
import { AllTasksTable } from "@/components/teacher/all-tasks-table";
import { Edit3, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard-header";

export default function TeacherDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <DashboardHeader
        title="Teacher Dashboard"
        breadcrumbs={[
          { label: "Teacher" },
          { label: "Overview" }
        ]}
        leftContent={
          <div className="relative hidden md:block w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input 
              placeholder="Search tasks, students..." 
              className="pl-9 bg-[#1a211e] border-white/10 text-sm h-9 focus-visible:ring-1 focus-visible:ring-[var(--sage)] placeholder:text-zinc-600 rounded-md text-white"
            />
          </div>
        }
      >
        <Link href="/teacher/assign">
          <Button variant="ghost" size="icon" className="size-9 rounded-full bg-[#1a211e] border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10">
            <Edit3 className="size-4" />
          </Button>
        </Link>
      </DashboardHeader>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-4">
          <TeacherMetricCards />
          <StudentList />
          <ReviewQueue />
          <AllTasksTable />
        </div>
      </main>
    </div>
  );
}
