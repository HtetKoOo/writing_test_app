"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowLeft, Clock, AlertTriangle } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationDropdown } from "@/components/notification-dropdown";

interface Task {
  id: string;
  _id?: string;
  title: string;
  _title?: string;
  taskType: string;
  _taskType?: string;
  status: string;
  _status?: string;
  submittedAt?: string;
  _submittedAt?: string;
  createdAt?: string;
  assignedTo?: {
    name?: string;
    email?: string;
  } | string;
}

export default function StandaloneReviewQueuePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoading(true);
        const response = await api.get("/teacher/assigned-tasks");
        const data = response.data?.data;
        const allTasks: Task[] = Array.isArray(data) ? data : (data?.tasks || data?.items || []);
        
        // Filter tasks that are submitted and waiting review, sorted by oldest first
        const pending = allTasks
          .filter((t) => (t.status || t._status) === "SUBMITTED")
          .sort((a, b) => {
            const dateA = new Date(a.submittedAt || a._submittedAt || a.createdAt || 0).getTime();
            const dateB = new Date(b.submittedAt || b._submittedAt || b.createdAt || 0).getTime();
            return dateA - dateB;
          });

        setTasks(pending);
      } catch (error) {
        console.error("Failed to fetch pending queue:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredTasks = tasks.filter((t) => {
    const title = t.title || t._title || "";
    const studentName =
      typeof t.assignedTo === "object"
        ? t.assignedTo?.name || t.assignedTo?.email || ""
        : t.assignedTo || "";
    
    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      studentName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614]">
        <div className="flex items-center gap-4">
          <Link href="/teacher" className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
            <ArrowLeft className="size-3.5" /> Dashboard
          </Link>
          <span className="text-zinc-700 select-none">/</span>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Review Queue</h1>
            <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
              <span>Teacher</span>
              <span>›</span>
              <span className="text-zinc-400">Feedback Pending</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationDropdown />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">

          {/* Alert Header Summary */}
          <div className="flex items-center justify-between bg-amber-500/5 border border-amber-500/10 rounded-xl p-5 gap-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-[var(--gold)]">
                <AlertTriangle className="size-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white leading-none">Pending Feedbacks</h3>
                <span className="text-xs text-zinc-500 block mt-1">
                  These essays have been fully submitted by your students and are waiting for grading and band score feedback.
                </span>
              </div>
            </div>
            <div className="text-right select-none font-mono">
              <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Awaiting review</span>
              <span className="text-xl font-extrabold text-[var(--gold)]">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</span>
            </div>
          </div>

          {/* Queue Card */}
          <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none overflow-hidden mt-6">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 bg-[#151b18] border-b border-white/5">
              <CardTitle className="text-sm font-semibold text-white">Review Checklist (Oldest First)</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Search by student or essay title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-[#111614] border-white/10 text-xs h-8 focus-visible:ring-1 focus-visible:ring-emerald-500 rounded-md"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <Table>
                  <TableHeader className="bg-[#151b18]/40 border-b border-white/5">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="py-3 pl-6"><Skeleton className="h-4 w-20 bg-white/5" /></TableHead>
                      <TableHead className="py-3"><Skeleton className="h-4 w-32 bg-white/5" /></TableHead>
                      <TableHead className="py-3"><Skeleton className="h-4 w-12 bg-white/5" /></TableHead>
                      <TableHead className="py-3"><Skeleton className="h-4 w-24 bg-white/5" /></TableHead>
                      <TableHead className="py-3 pr-6 text-right"><Skeleton className="h-4 w-16 bg-white/5 ml-auto" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i} className="border-white/5">
                        <TableCell className="py-3.5 pl-6"><Skeleton className="h-4 w-24 bg-white/5" /></TableCell>
                        <TableCell className="py-3.5"><Skeleton className="h-4 w-44 bg-white/5" /></TableCell>
                        <TableCell className="py-3.5"><Skeleton className="h-4 w-14 bg-white/5" /></TableCell>
                        <TableCell className="py-3.5"><Skeleton className="h-4 w-24 bg-white/5" /></TableCell>
                        <TableCell className="py-3.5 pr-6 text-right"><Skeleton className="h-8 w-20 bg-white/5 ml-auto" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : filteredTasks.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center min-h-[220px] gap-2 select-none">
                  <div className="text-4xl mb-1">🎉</div>
                  <h3 className="text-white font-bold text-base leading-none">All clear!</h3>
                  <p className="text-zinc-500 text-xs font-mono">
                    {search ? "No pending reviews match your search query." : "No tasks waiting for review."}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-[#151b18]/40 border-b border-white/5">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3 pl-6">Student</TableHead>
                      <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Essay Title</TableHead>
                      <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Type</TableHead>
                      <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Submitted Date</TableHead>
                      <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3 pr-6 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task, i) => {
                      const tid = task.id || task._id;
                      const title = task.title || task._title || "Untitled Essay";
                      const type = task.taskType || task._taskType || "TASK_1";
                      const studentName =
                        typeof task.assignedTo === "object"
                          ? task.assignedTo?.name || task.assignedTo?.email || "—"
                          : task.assignedTo || "—";

                      return (
                        <TableRow key={tid || i} className="border-white/5 hover:bg-white/[0.02]">
                          <TableCell className="font-semibold text-xs text-zinc-200 py-4 pl-6">
                            {studentName}
                          </TableCell>
                          <TableCell className="text-zinc-200 font-semibold text-xs py-4">{title}</TableCell>
                          <TableCell className="text-zinc-400 font-mono text-[10px] py-4">{type}</TableCell>
                          <TableCell className="text-xs text-zinc-400 font-mono py-4">
                            <span className="flex items-center gap-1.5">
                              <Clock className="size-3 text-zinc-500" />
                              {formatDate(task.submittedAt || task._submittedAt || task.createdAt)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right py-4 pr-6">
                            <Link href={`/teacher/review/${tid}`}>
                              <Button
                                size="sm"
                                className="bg-amber-500/10 hover:bg-amber-500/20 text-[var(--gold)] border border-amber-500/20 font-bold h-8 text-[11px] px-3.5"
                              >
                                Review →
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
