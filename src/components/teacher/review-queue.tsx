"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

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

export function ReviewQueue() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
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
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-zinc-400 animate-pulse" />
            <CardTitle className="text-sm font-semibold text-white">Review Queue</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="mt-2 space-y-4 pb-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48 bg-white/5" />
                <Skeleton className="h-3 w-32 bg-white/5" />
              </div>
              <Skeleton className="h-8 w-20 bg-white/5" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-zinc-400" />
            <CardTitle className="text-sm font-semibold text-white">Review Queue</CardTitle>
          </div>
          <span className="text-xs text-zinc-500 font-mono tracking-tight hidden sm:block">
            Submitted tasks · oldest first · shows time of submission
          </span>
        </CardHeader>
        <CardContent className="mt-2 flex flex-col items-center justify-center min-h-[200px] gap-2 pb-10">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-white font-bold text-lg leading-none">All clear!</h3>
          <p className="text-zinc-500 text-sm">No tasks waiting for review.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#151b18] border-b border-white/5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-[var(--gold)]" />
          <CardTitle className="text-sm font-semibold text-white">Review Queue</CardTitle>
        </div>
        <span className="text-xs text-zinc-500 font-mono tracking-tight hidden sm:block">
          Submitted tasks · oldest first · shows time of submission
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col">
          {tasks.map((task, i) => {
            const tid = task.id || task._id;
            const studentName =
              typeof task.assignedTo === "object"
                ? task.assignedTo.name || task.assignedTo.email
                : task.assignedTo || "—";
            const title = task.title || task._title || "Untitled Task";
            const type = task.taskType || task._taskType || "TASK_1";

            return (
              <div
                key={tid || i}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors gap-4"
              >
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-zinc-200 truncate leading-snug">
                    {title}
                  </span>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-zinc-500">
                    <span className="truncate">{studentName}</span>
                    <span>•</span>
                    <span className="font-mono text-[10px] text-zinc-400">{type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatDate(task.submittedAt || task._submittedAt || task.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-start">
                  <Badge className="bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 select-none">
                    SUBMITTED
                  </Badge>
                  <Link href={`/teacher/review/${tid}`}>
                    <Button
                      size="sm"
                      className="bg-amber-500/10 hover:bg-amber-500/20 text-[var(--gold)] border border-amber-500/20 font-bold h-8 text-[11px] px-3.5"
                    >
                      Review →
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
