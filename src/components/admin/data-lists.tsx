"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";

interface Task {
  id: string;
  _id?: string;
  _title?: string;
  title?: string;
  _taskType?: string;
  taskType?: string;
  _status?: string;
  status?: string;
  _bandScore?: number | string | null;
  bandScore?: number | string | null;
  _updatedAt?: string;
  updatedAt?: string;
  createdAt?: string;
  _createdAt?: string;
}

export function DataListsSection() {
  const [pendingQueue, setPendingQueue] = useState<Task[]>([]);
  const [recentActivity, setRecentActivity] = useState<Task[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.get('/admin/writing-tasks?status=SUBMITTED&limit=5');
        // The backend might return data in items or directly as an array depending on the pagination setup
        const tasks = res.data.data.items || res.data.data;
        setPendingQueue(Array.isArray(tasks) ? tasks : []);
      } catch (error) {
        console.error("Failed to fetch pending tasks:", error);
      } finally {
        setLoadingPending(false);
      }
    };

    const fetchRecent = async () => {
      try {
        const res = await api.get('/admin/writing-tasks?limit=5');
        const tasks = res.data.data.items || res.data.data;
        setRecentActivity(Array.isArray(tasks) ? tasks : []);
      } catch (error) {
        console.error("Failed to fetch recent tasks:", error);
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchPending();
    fetchRecent();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
      {/* Pending Review Queue */}
      <Card className="bg-[#1a211e] border-white/5 rounded-xl lg:col-span-1 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-white">Pending review queue</CardTitle>
          <Link href="/admin/review" className="text-xs text-blue-400 flex items-center hover:text-blue-300 transition-colors">
            View all <ArrowRight className="size-3 ml-1" />
          </Link>
        </CardHeader>
        <CardContent className="mt-2">
          <div className="flex flex-col gap-0">
            {loadingPending ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32 bg-white/5" />
                    <Skeleton className="h-3 w-48 bg-white/5" />
                  </div>
                  <Skeleton className="h-8 w-16 bg-white/5" />
                </div>
              ))
            ) : pendingQueue.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-sm">No pending tasks to review</div>
            ) : (
              pendingQueue.map((item, i) => (
                <div key={item.id || item._id || i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-zinc-200">{item.title || item._title || "Untitled"}</span>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-wider">
                      {item.taskType || item._taskType || "TASK_1"} • Submitted {formatDate(item.updatedAt || item._updatedAt || item.createdAt || item._createdAt)}
                    </span>
                  </div>
                  <Button asChild variant="outline" size="sm" className="bg-transparent border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold)] h-8 px-3 cursor-pointer">
                    <Link href={`/admin/review/${item.id || item._id}`}>
                      Review
                    </Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Table */}
      <Card className="bg-[#1a211e] border-white/5 rounded-xl lg:col-span-2 shadow-none overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white">Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-2">
          <Table>
            <TableHeader className="bg-[#151b18]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Title</TableHead>
                <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Status</TableHead>
                <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Band</TableHead>
                <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Updated</TableHead>
                <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingRecent ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className="border-white/5 hover:bg-white/5">
                    <TableCell className="py-4"><Skeleton className="h-4 w-32 bg-white/5" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-5 w-20 bg-white/5 rounded-full" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-8 bg-white/5" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-24 bg-white/5" /></TableCell>
                    <TableCell className="py-4 flex justify-end"><Skeleton className="h-8 w-16 bg-white/5" /></TableCell>
                  </TableRow>
                ))
              ) : recentActivity.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-zinc-500 text-sm">No recent activity</TableCell>
                </TableRow>
              ) : (
                recentActivity.map((activity, i) => {
                  const status = activity.status || activity._status || "UNKNOWN";
                  const bandScore = activity.bandScore || activity._bandScore || "—";
                  return (
                    <TableRow key={activity.id || activity._id || i} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-medium text-sm text-zinc-200 py-4">
                        {activity.title || activity._title || "Untitled"}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant={status === 'COMPLETED' ? 'default' : 'secondary'} className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 ${
                          status === 'ASSIGNED' 
                            ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                            : status === 'SUBMITTED' 
                              ? 'bg-[var(--gold)]/10 text-[var(--gold)] hover:bg-[var(--gold)]/20'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm py-4">{bandScore}</TableCell>
                      <TableCell className="text-xs text-zinc-500 max-w-[80px] py-4">{formatDate(activity.updatedAt || activity._updatedAt)}</TableCell>
                      <TableCell className="text-right py-4">
                        <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-zinc-400 border border-white/10 hover:text-white hover:bg-white/10 cursor-pointer">
                          <Link href={`/admin/review/${activity.id || activity._id}`}>
                            View
                          </Link>
                        </Button>
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
  );
}
