"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock, PenTool } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function StudentStats() {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/writing-tasks');
        const tasks = response.data.data.items || response.data.data || [];
        
        const counts = tasks.reduce((acc: any, task: any) => {
          acc.total++;
          if (task.status === 'SCORED' || task.status === 'COMPLETED') acc.completed++;
          else if (task.status === 'ASSIGNED' || task.status === 'WRITING') acc.pending++;
          return acc;
        }, { total: 0, completed: 0, pending: 0 });

        setStats(counts);
      } catch (error) {
        console.error("Failed to fetch student stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const metrics = [
    {
      title: "TOTAL TASKS",
      value: stats.total.toString(),
      icon: <PenTool className="size-4 text-blue-400" />,
      iconBg: "bg-blue-500/10",
    },
    {
      title: "COMPLETED",
      value: stats.completed.toString(),
      icon: <CheckCircle className="size-4 text-emerald-400" />,
      iconBg: "bg-emerald-500/10",
    },
    {
      title: "PENDING",
      value: stats.pending.toString(),
      icon: <Clock className="size-4 text-[var(--gold)]" />,
      iconBg: "bg-[var(--gold)]/10",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
            <CardContent className="p-5 flex flex-col h-[120px] justify-between">
              <Skeleton className="size-8 rounded-md bg-white/5" />
              <Skeleton className="h-4 w-24 bg-white/5" />
              <Skeleton className="h-8 w-12 bg-white/5" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric, i) => (
        <Card key={i} className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
          <CardContent className="p-5 flex flex-col h-[120px] justify-between">
            <div>
              <div className={`size-8 rounded-md flex items-center justify-center mb-4 ${metric.iconBg}`}>
                {metric.icon}
              </div>
              <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-1">
                {metric.title}
              </p>
              <h3 className="text-3xl font-semibold text-white tracking-tight">
                {metric.value}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
