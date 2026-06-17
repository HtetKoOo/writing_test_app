"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Clock, Search, ExternalLink } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface Task {
  id: string;
  _id?: string;
  title: string;
  _title?: string;
  taskType: string;
  _taskType?: string;
  status: string;
  _status?: string;
  wordCount?: number;
  _wordCount?: number;
  dueDate?: string;
  _dueDate?: string;
  submittedAt?: string;
  _submittedAt?: string;
  createdAt?: string;
  bandScore?: number;
  _bandScore?: number;
}

interface StudentInfo {
  id: string;
  _id?: string;
  name: string;
  email: string;
}

export default function StudentTasksPage() {
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchStudentTasks = async () => {
      if (!studentId) return;
      try {
        setLoading(true);
        const response = await api.get(`/teacher/students/${studentId}/tasks`);
        const data = response.data?.data ?? {};

        // Parse student & tasks
        setStudent(data.student ?? null);
        setTasks(Array.isArray(data) ? data : (data.tasks ?? []));
      } catch (error) {
        console.error("Failed to load student tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentTasks();
  }, [studentId]);

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "S";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Filter tasks based on status selection
  const filteredTasks = statusFilter === "all"
    ? tasks
    : tasks.filter(t => (t.status || t._status) === statusFilter);

  // Sort tasks: submitted first (urgency), then newest by creation date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const statusA = a.status || a._status || "";
    const statusB = b.status || b._status || "";
    const aUrgent = statusA === "SUBMITTED";
    const bUrgent = statusB === "SUBMITTED";
    if (aUrgent && !bUrgent) return -1;
    if (!aUrgent && bUrgent) return 1;
    
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  const total = tasks.length;
  const pending = tasks.filter(t => (t.status || t._status) === "SUBMITTED").length;
  const scored = tasks.filter(t => (t.status || t._status) === "SCORED").length;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614]">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden text-zinc-400 hover:text-white" />
          <Link href="/teacher" className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
            <ArrowLeft className="size-3.5" /> Dashboard
          </Link>
          <span className="text-zinc-700 select-none">/</span>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {student ? `${student.name}'s Tasks` : "Student Tasks"}
            </h1>
            <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
              <span>Teacher</span>
              <span>›</span>
              <span className="text-zinc-400">Students</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href={`/teacher/assign?studentId=${studentId}`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 text-xs gap-1.5">
              + Assign task
            </Button>
          </Link>
          <NotificationDropdown />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Student profile summary block */}
          {loading ? (
            <div className="flex items-center gap-4 py-4 animate-pulse">
              <Skeleton className="size-12 rounded-full bg-white/5" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 bg-white/5" />
                <Skeleton className="h-4 w-52 bg-white/5" />
              </div>
            </div>
          ) : (
            student && (
              <div className="flex items-center gap-5 p-2 animate-fadeIn">
                <Avatar className="size-12 border border-white/10 select-none">
                  <AvatarFallback className="bg-[#4d6a45] text-white font-bold text-lg">
                    {getInitial(student.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-base font-semibold text-zinc-200 leading-none">{student.name}</h2>
                  <span className="text-xs text-zinc-500 block mt-1.5">{student.email}</span>
                  <div className="flex items-center gap-2.5 mt-3 select-none">
                    <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-400 text-[10px] px-2.5 py-0.5 font-mono">
                      {total} total
                    </Badge>
                    {pending > 0 && (
                      <Badge variant="outline" className="border-[var(--gold)]/20 bg-[var(--gold)]/10 text-[var(--gold)] text-[10px] px-2.5 py-0.5 font-mono">
                        {pending} awaiting review
                      </Badge>
                    )}
                    {scored > 0 && (
                      <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[10px] px-2.5 py-0.5 font-mono">
                        {scored} scored
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          )}

          {/* Table Card */}
          <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none overflow-hidden mt-6">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 bg-[#151b18] border-b border-white/5">
              <CardTitle className="text-sm font-semibold text-white">Assigned tasks checklist</CardTitle>
              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-8 rounded-md border border-white/10 bg-transparent px-3 py-1 text-xs text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all" className="bg-[#1a211e]">All statuses</option>
                  <option value="ASSIGNED" className="bg-[#1a211e]">Assigned</option>
                  <option value="WRITING" className="bg-[#1a211e]">Writing</option>
                  <option value="SUBMITTED" className="bg-[#1a211e]">Submitted</option>
                  <option value="REVIEWED" className="bg-[#1a211e]">Reviewed</option>
                  <option value="SCORED" className="bg-[#1a211e]">Scored</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#151b18]/40 border-b border-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3 pl-6">Title</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Type</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Status</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Words</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Due Date</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Submitted</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Score</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3 pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i} className="border-white/5">
                        <TableCell className="py-3 pl-6"><Skeleton className="h-4 w-40 bg-white/5" /></TableCell>
                        <TableCell className="py-3"><Skeleton className="h-4 w-14 bg-white/5" /></TableCell>
                        <TableCell className="py-3"><Skeleton className="h-5 w-20 bg-white/5 rounded-full" /></TableCell>
                        <TableCell className="py-3"><Skeleton className="h-4 w-12 bg-white/5" /></TableCell>
                        <TableCell className="py-3"><Skeleton className="h-4 w-20 bg-white/5" /></TableCell>
                        <TableCell className="py-3"><Skeleton className="h-4 w-20 bg-white/5" /></TableCell>
                        <TableCell className="py-3"><Skeleton className="h-4 w-16 bg-white/5" /></TableCell>
                        <TableCell className="py-3 pr-6 text-right"><Skeleton className="h-7 w-16 bg-white/5 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : sortedTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center text-zinc-500 text-sm">No tasks assigned with this filter.</TableCell>
                    </TableRow>
                  ) : (
                    sortedTasks.map((task, i) => {
                      const tid = task.id || task._id;
                      const status = (task.status || task._status || "ASSIGNED").toUpperCase();
                      const title = task.title || task._title || "Untitled";
                      const type = task.taskType || task._taskType || "TASK_1";
                      const score = task.bandScore ?? task._bandScore;
                      const canReview = status === "SUBMITTED";

                      return (
                        <TableRow key={tid || i} className="border-white/5 hover:bg-white/[0.02]">
                          <TableCell className="font-semibold text-xs text-zinc-200 py-3.5 pl-6">
                            {title}
                          </TableCell>
                          <TableCell className="text-zinc-400 font-mono text-[10px] py-3.5">{type}</TableCell>
                          <TableCell className="py-3.5">
                            <Badge
                              variant="secondary"
                              className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 ${
                                status === "ASSIGNED"
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  : status === "SUBMITTED"
                                  ? "bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              }`}
                            >
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-zinc-400 font-mono text-xs py-3.5">
                            {task.wordCount || task._wordCount || "—"}
                          </TableCell>
                          <TableCell className="text-xs text-zinc-400 font-mono py-3.5">
                            {formatDate(task.dueDate || task._dueDate)}
                          </TableCell>
                          <TableCell className="text-xs text-zinc-400 font-mono py-3.5">
                            {formatDate(task.submittedAt || task._submittedAt)}
                          </TableCell>
                          <TableCell className="text-zinc-200 font-mono font-bold text-xs py-3.5">
                            {score != null ? `Band ${score}` : "—"}
                          </TableCell>
                          <TableCell className="text-right py-3.5 pr-6">
                            <Link href={`/teacher/review/${tid}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-8 text-[11px] font-bold px-3 border border-white/10 transition-all ${
                                  canReview
                                    ? "bg-amber-500/10 text-[var(--gold)] border-amber-500/20 hover:bg-amber-500/20"
                                    : "text-zinc-300 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                {canReview ? "Review →" : "View"}
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
