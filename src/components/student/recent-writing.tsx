"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentWriting() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/writing-tasks?limit=5');
        const items = response.data.data.items || response.data.data || [];
        setTasks(items);
      } catch (error) {
        console.error("Failed to fetch recent writing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-white">Recent Writing Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-[#151b18]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Task</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Status</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Score</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i} className="border-white/5">
                  <TableCell className="py-4"><Skeleton className="h-4 w-32 bg-white/5" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-5 w-16 bg-white/5 rounded-full" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-4 w-8 bg-white/5" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-4 w-12 bg-white/5" /></TableCell>
                </TableRow>
              ))
            ) : tasks.length === 0 ? (
              <TableRow key="empty">
                <TableCell colSpan={4} className="py-8 text-center text-zinc-500 text-sm">No activity yet</TableCell>
              </TableRow>
            ) : (
              tasks.map((task, i) => (
                <TableRow key={task.id || task._id || i} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium text-sm text-zinc-200 py-4">
                    {task.title || task._title || "Untitled"}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="secondary" className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-zinc-800 text-zinc-400">
                      {task.status || task._status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-300 font-mono text-sm py-4">
                    {task.bandScore || task._bandScore || "—"}
                  </TableCell>
                  <TableCell className="text-[11px] text-zinc-500 py-4">
                    {formatDate(task.updatedAt || task.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
