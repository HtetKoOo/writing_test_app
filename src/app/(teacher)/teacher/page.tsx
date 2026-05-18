import React from "react";
import { TeacherMetricCards } from "@/components/teacher/teacher-metric-cards";
import { StudentList } from "@/components/teacher/student-list";
import { ReviewQueue } from "@/components/teacher/review-queue";
import { AllTasksTable } from "@/components/teacher/all-tasks-table";
import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NotificationDropdown } from "@/components/notification-dropdown";

export default function TeacherDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614]">
        <div className="flex items-center gap-12">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Teacher Dashboard</h1>
            <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
              <span>Teacher</span>
              <span>›</span>
              <span className="text-zinc-400">Overview</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/teacher/assign">
            <Button variant="ghost" size="icon" className="size-9 rounded-full bg-[#1a211e] border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10">
              <Edit3 className="size-4" />
            </Button>
          </Link>
          <NotificationDropdown />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-4">
          <TeacherMetricCards />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <StudentList />
            <ReviewQueue />
          </div>
          <AllTasksTable />
        </div>
      </main>
    </div>
  );
}
