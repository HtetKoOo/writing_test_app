"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Hourglass, Plus } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function TeacherMetricCards() {
  const [stats, setStats] = useState({ awaiting: 0, reviewed: 0, scored: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // We fetch all tasks assigned by this teacher and count statuses
        // In a real app, a dedicated /teacher/stats endpoint would be better
        const response = await api.get('/teacher/assigned-tasks');
        const data = response.data?.data;
        const tasks = Array.isArray(data) ? data : (data?.tasks || data?.items || []);
        
        const counts = tasks.reduce((acc: any, task: any) => {
          const status = task.status || task._status;
          if (status === 'SUBMITTED') acc.awaiting++;
          else if (status === 'REVIEWED') acc.reviewed++;
          else if (status === 'SCORED') acc.scored++;
          return acc;
        }, { awaiting: 0, reviewed: 0, scored: 0 });

        setStats(counts);
      } catch (error) {
        console.error("Failed to fetch teacher stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const metrics = [
    {
      title: "AWAITING REVIEW",
      value: stats.awaiting.toString(),
      icon: <Hourglass className="size-4 text-[var(--gold)]" />,
      iconBg: "bg-[var(--gold)]/10",
    },
    {
      title: "REVIEWED",
      value: stats.reviewed.toString(),
      icon: <Check className="size-4 text-blue-400" />,
      iconBg: "bg-blue-500/10",
    },
    {
      title: "SCORED",
      value: stats.scored.toString(),
      icon: <Plus className="size-4 text-emerald-400" />,
      iconBg: "bg-emerald-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
            <CardContent className="p-5 flex flex-col h-[140px] justify-between">
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
          <CardContent className="p-5 flex flex-col h-[140px] justify-between">
            <div>
              <div className={`size-8 rounded-md flex items-center justify-center mb-6 ${metric.iconBg}`}>
                {metric.icon}
              </div>
              <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-1">
                {metric.title}
              </p>
              <h3 className="text-4xl font-semibold text-white tracking-tight">
                {metric.value}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
