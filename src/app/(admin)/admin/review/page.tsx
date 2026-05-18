"use client";

import React, { useEffect, useState } from "react";
import { 
  ListTodo, 
  Search, 
  Filter, 
  MoreVertical, 
  FileEdit,
  User,
  Clock,
  ArrowRight
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import api from "@/lib/api";

interface Task {
  id: string;
  _id?: string;
  title: string;
  status: string;
  taskType: string;
  updatedAt: string;
  userId: string;
}

export default function ReviewQueuePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      // Fetch only SUBMITTED tasks
      const res = await api.get('/admin/writing-tasks?status=SUBMITTED');
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch review queue:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Review Queue</h1>
          <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
            <span>Admin</span>
            <span>›</span>
            <span className="text-zinc-400">Content Review</span>
          </div>
        </div>
        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 py-1 px-3">
          {tasks.length} Pending Reviews
        </Badge>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Info Card */}
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/10 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Pending Submissions</h2>
              <p className="text-zinc-500 text-sm mt-1">These tasks have been submitted by students and are waiting for feedback.</p>
            </div>
            <ListTodo className="size-12 text-amber-500/20" />
          </div>

          {/* Table Container */}
          <div className="bg-[#1a211e] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <Table>
              <TableHeader className="bg-[#151b18]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4 pl-6">Task</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Type</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Submitted At</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4 text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i} className="border-white/5">
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-64 bg-white/5" />
                          <Skeleton className="h-3 w-32 bg-white/5" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-5 w-16 bg-white/5 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32 bg-white/5" /></TableCell>
                      <TableCell className="text-right pr-6"><Skeleton className="h-8 w-24 ml-auto bg-white/5 rounded-lg" /></TableCell>
                    </TableRow>
                  ))
                ) : tasks.length === 0 ? (
                  <TableRow key="empty">
                    <TableCell colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-zinc-500">
                        <Clock className="size-12 opacity-20" />
                        <p>No tasks waiting for review</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task, idx) => (
                    <TableRow key={task.id || task._id || idx} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">{task.title}</span>
                          <span className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1">
                            <User className="size-3" /> {task.userId}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider text-zinc-400 border-white/10">
                          {task.taskType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">
                        {formatDate(task.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white gap-2 h-8 px-4 text-xs font-semibold shadow-lg shadow-amber-900/20 transition-all cursor-pointer">
                          <Link href={`/admin/review/${task.id || task._id}`}>
                            Review Task
                            <ArrowRight className="size-3 inline-block ml-2" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
