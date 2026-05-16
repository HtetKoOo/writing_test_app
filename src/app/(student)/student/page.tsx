"use client";

import React from "react";
import { StudentStats } from "@/components/student/student-stats";
import { AssignedTasks } from "@/components/student/assigned-tasks";
import { RecentWriting } from "@/components/student/recent-writing";
import { Search, Bell, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth-provider";

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614]">
        <div className="flex items-center gap-12">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Student Dashboard</h1>
            <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
              <span>Student</span>
              <span>›</span>
              <span className="text-zinc-400">Overview</span>
            </div>
          </div>
          
          <div className="relative hidden md:block w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input 
              placeholder="Search tasks, vocabulary..." 
              className="pl-9 bg-[#1a211e] border-white/10 text-sm h-9 focus-visible:ring-1 focus-visible:ring-gold placeholder:text-zinc-600 rounded-md text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold animate-pulse">
            <Sparkles className="size-3" />
            <span>Target: Band 7.5</span>
          </div>
          <Button variant="ghost" size="icon" className="size-9 rounded-full bg-[#1a211e] border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10">
            <Bell className="size-4" />
          </Button>
          <Avatar className="size-9 border-2 border-gold/30 rounded-full">
            <AvatarImage src="" />
            <AvatarFallback className="bg-white text-black font-bold text-xs">
              {user?.name?.substring(0, 2).toUpperCase() || 'ST'}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          {/* Welcome Message */}
          <div>
            <h2 className="text-2xl font-bold text-white font-serif">Welcome back, {user?.name?.split(' ')[0] || 'Scholar'}!</h2>
            <p className="text-zinc-500 text-sm mt-1">Ready to improve your IELTS writing today?</p>
          </div>

          <StudentStats />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1">
              <AssignedTasks />
            </div>
            <div className="xl:col-span-2">
              <RecentWriting />
            </div>
          </div>

          {/* Quick Links / Tips Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#1a211e] to-[#111614] border border-white/5 flex flex-col justify-between group cursor-pointer hover:border-gold/30 transition-all">
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-gold transition-colors">Practice Task 1</h3>
                <p className="text-zinc-500 text-sm mt-2">Describe graphs, tables, charts or diagrams in at least 150 words.</p>
              </div>
              <Button variant="link" className="text-gold p-0 w-fit mt-4 flex items-center gap-2">
                Go to Practice <ArrowRight className="size-3" />
              </Button>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#1a211e] to-[#111614] border border-white/5 flex flex-col justify-between group cursor-pointer hover:border-gold/30 transition-all">
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-gold transition-colors">Practice Task 2</h3>
                <p className="text-zinc-500 text-sm mt-2">Write an essay in response to a point of view, argument or problem.</p>
              </div>
              <Button variant="link" className="text-gold p-0 w-fit mt-4 flex items-center gap-2">
                Go to Practice <ArrowRight className="size-3" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper icons missing in imports
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
