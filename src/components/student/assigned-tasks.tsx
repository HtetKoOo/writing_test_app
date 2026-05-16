"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function AssignedTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch tasks with status ASSIGNED
        const response = await api.get('/writing-tasks?status=ASSIGNED');
        const items = response.data.data.items || response.data.data || [];
        setTasks(items);
      } catch (error) {
        console.error("Failed to fetch assigned tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold text-white">Assigned by Teachers</CardTitle>
        <Link href="/student/practice" className="text-xs text-gold flex items-center hover:underline">
          View all <ArrowRight className="size-3 ml-1" />
        </Link>
      </CardHeader>
      <CardContent className="mt-2">
        <div className="flex flex-col gap-0">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32 bg-white/5" />
                  <Skeleton className="h-3 w-48 bg-white/5" />
                </div>
                <Skeleton className="h-8 w-20 bg-white/5" />
              </div>
            ))
          ) : tasks.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-sm italic">
              No tasks currently assigned to you.
            </div>
          ) : (
            tasks.map((task, i) => (
              <div key={task.id || task._id || i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-200">{task.title || task._title || "Untitled Task"}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] uppercase border-white/10 text-zinc-500 px-1 py-0 h-4">
                      {task.taskType || task._taskType || "TASK_1"}
                    </Badge>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Calendar className="size-3" /> Due {formatDate(task.dueDate || task._dueDate)}
                    </span>
                  </div>
                </div>
                <Link href={`/student/writing/${task.id || task._id}`}>
                  <Button size="sm" className="bg-gold hover:bg-gold-light text-slate-900 h-8 font-semibold">
                    Start
                  </Button>
                </Link>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
