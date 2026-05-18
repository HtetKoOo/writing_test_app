"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Task {
  id: string;
  _id?: string;
  title: string;
  _title?: string;
  student?: {
    name: string;
  } | string;
  taskType: string;
  _taskType?: string;
  status: string;
  _status?: string;
  dueDate?: string;
  _dueDate?: string;
  updatedAt?: string;
}

export function AllTasksTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        
        const response = await api.get('/teacher/assigned-tasks', { params });
        const data = response.data?.data;
        const items = Array.isArray(data) ? data : (data?.tasks || data?.items || []);
        setTasks(items);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [statusFilter]);

  const filteredTasks = tasks.filter(task => {
    const title = task.title || task._title || "";
    return title.toLowerCase().includes(search.toLowerCase());
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none overflow-hidden mt-4">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <CardTitle className="text-sm font-semibold text-white">All Tasks</CardTitle>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
            <Input 
              placeholder="Search by title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-transparent border-white/10 text-xs h-8 focus-visible:ring-1 focus-visible:ring-emerald-500 placeholder:text-zinc-600 rounded-md text-white"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 rounded-md border border-white/10 bg-transparent px-3 py-1 text-xs text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none pr-8 relative"
          >
            <option value="all" className="bg-[#1a211e]">All statuses</option>
            <option value="ASSIGNED" className="bg-[#1a211e]">Assigned</option>
            <option value="SUBMITTED" className="bg-[#1a211e]">Submitted</option>
            <option value="REVIEWED" className="bg-[#1a211e]">Reviewed</option>
            <option value="SCORED" className="bg-[#1a211e]">Scored</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-[#151b18]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Title</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Student</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Type</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Status</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Due</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-white/5 hover:bg-white/5">
                  <TableCell className="py-3"><Skeleton className="h-4 w-32 bg-white/5" /></TableCell>
                  <TableCell className="py-3"><Skeleton className="h-4 w-24 bg-white/5" /></TableCell>
                  <TableCell className="py-3"><Skeleton className="h-4 w-16 bg-white/5" /></TableCell>
                  <TableCell className="py-3"><Skeleton className="h-5 w-20 bg-white/5 rounded-full" /></TableCell>
                  <TableCell className="py-3"><Skeleton className="h-4 w-20 bg-white/5" /></TableCell>
                  <TableCell className="py-3 text-right"><Skeleton className="h-7 w-12 bg-white/5 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-zinc-500 text-sm">No tasks found</TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task, i) => {
                const status = task.status || task._status || "ASSIGNED";
                const title = task.title || task._title || "Untitled";
                const type = task.taskType || task._taskType || "TASK_1";
                const studentName = typeof task.student === 'object' ? task.student.name : (task.student || "—");

                return (
                  <TableRow key={task.id || task._id || i} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-semibold text-xs text-zinc-200 py-3">
                      {title}
                    </TableCell>
                    <TableCell className="text-zinc-500 text-xs py-3">{studentName}</TableCell>
                    <TableCell className="text-zinc-400 font-mono text-xs py-3">{type}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant={status === 'SCORED' ? 'default' : 'secondary'} className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 ${
                        status === 'ASSIGNED' 
                          ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20' 
                          : status === 'SUBMITTED'
                            ? 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20'
                            : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20'
                      }`}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-zinc-400 font-mono py-3">{formatDate(task.dueDate || task._dueDate)}</TableCell>
                    <TableCell className="text-right py-3">
                      <Link href={`/teacher/review/${task.id || task._id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-[11px] font-semibold text-zinc-300 border border-white/10 hover:text-white hover:bg-white/10">
                          {status === "SUBMITTED" ? "Review →" : "View"}
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
  );
}
