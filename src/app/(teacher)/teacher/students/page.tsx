"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Users, CheckCircle, Clock } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface Student {
  id: string;
  _id?: string;
  name: string;
  email: string;
  taskStats?: {
    total: number;
    pending: number;
  };
}

export default function MyStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/teacher/students?stats=true");
        setStudents(response.data?.data ?? []);
      } catch (error) {
        console.error("Failed to load students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "S";
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  // Quick stats calculations
  const totalStudents = students.length;
  const pendingReviewsCount = students.reduce(
    (acc, s) => acc + (s.taskStats?.pending ?? 0),
    0
  );
  const totalAssignedCount = students.reduce(
    (acc, s) => acc + (s.taskStats?.total ?? 0),
    0
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614]">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden text-zinc-400 hover:text-white" />
          <Link href="/teacher" className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
            <ArrowLeft className="size-3.5" /> Dashboard
          </Link>
          <span className="text-zinc-700 select-none">/</span>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">My Students</h1>
            <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
              <span>Teacher</span>
              <span>›</span>
              <span className="text-zinc-400">Classroom List</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/teacher/assign">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 text-xs">
              + Assign Task
            </Button>
          </Link>
          <NotificationDropdown />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Users className="size-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Total Students</span>
                  <span className="text-2xl font-bold text-white font-mono">{totalStudents}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Clock className="size-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Awaiting Review</span>
                  <span className="text-2xl font-bold text-amber-500 font-mono">{pendingReviewsCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <CheckCircle className="size-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Total Tasks Assigned</span>
                  <span className="text-2xl font-bold text-white font-mono">{totalAssignedCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student List Card */}
          <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none overflow-hidden mt-6">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 bg-[#151b18] border-b border-white/5">
              <CardTitle className="text-sm font-semibold text-white">Linked Students</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-[#111614] border-white/10 text-xs h-8 focus-visible:ring-1 focus-visible:ring-emerald-500 rounded-md"
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-5 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Skeleton className="size-11 rounded-full bg-white/5" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32 bg-white/5" />
                          <Skeleton className="h-3.5 w-44 bg-white/5" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-24 bg-white/5" />
                    </div>
                  ))}
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-sm font-mono">
                  {search ? "No students match your search query." : "No students are currently linked to your classroom."}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredStudents.map((student) => {
                    const sid = student.id || student._id;
                    const initial = getInitial(student.name);

                    return (
                      <div
                        key={sid}
                        className="p-5 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="size-11 border border-white/10 select-none">
                            <AvatarFallback className="bg-[#3a7d5a] text-white font-bold text-base">
                              {initial}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="block text-sm font-semibold text-zinc-200 leading-snug">
                              {student.name}
                            </span>
                            <span className="text-xs text-zinc-500 block mt-0.5">{student.email}</span>
                            <div className="flex items-center gap-2 mt-2 select-none">
                              <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-400 text-[10px] px-2.5 py-0.5 font-mono">
                                {student.taskStats?.total || 0} tasks
                              </Badge>
                              {(student.taskStats?.pending ?? 0) > 0 && (
                                <Badge variant="outline" className="border-[var(--gold)]/20 bg-[var(--gold)]/10 text-[var(--gold)] text-[10px] px-2.5 py-0.5 font-mono">
                                  {student.taskStats?.pending} pending
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link href={`/teacher/student-tasks/${sid}`}>
                            <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 h-8">
                              View tasks
                            </Button>
                          </Link>
                          <Link href={`/teacher/assign?studentId=${sid}`}>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 font-bold">
                              + Assign task
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
