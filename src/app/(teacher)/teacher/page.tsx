import React from "react";
import { TeacherMetricCards } from "@/components/teacher/teacher-metric-cards";
import { StudentList } from "@/components/teacher/student-list";
import { ReviewQueueEmpty } from "@/components/teacher/review-queue-empty";
import { AllTasksTable } from "@/components/teacher/all-tasks-table";
import { Search, Bell, Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
          
          <div className="relative hidden md:block w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input 
              placeholder="Search tasks, students..." 
              className="pl-9 bg-[#1a211e] border-white/10 text-sm h-9 focus-visible:ring-1 focus-visible:ring-emerald-500 placeholder:text-zinc-600 rounded-md text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="size-9 rounded-full bg-[#1a211e] border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10">
            <Edit3 className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-9 rounded-full bg-white text-black hover:bg-zinc-200">
            <span className="sr-only">Notifications</span>
            <Bell className="size-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-4">
          <TeacherMetricCards />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <StudentList />
            <ReviewQueueEmpty />
          </div>
          <AllTasksTable />
        </div>
      </main>
    </div>
  );
}
