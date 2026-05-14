"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, Flag, GraduationCap, Hourglass, Sparkles, Users } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminStats {
  users: {
    total: number;
    admins: number;
    teachers: number;
    newThisWeek: number;
  };
  tasks: {
    total: number;
    submitted: number;
    reviewed: number;
    scored: number;
    draft: number;
  };
}

export function MetricCards() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const metrics = [
    {
      title: "TOTAL USERS",
      value: stats?.users.total.toString() || "0",
      icon: <Users className="size-4 text-blue-400" />,
      iconBg: "bg-blue-500/10",
      description: "",
    },
    {
      title: "NEW THIS WEEK",
      value: stats?.users.newThisWeek.toString() || "0",
      icon: <Sparkles className="size-4 text-emerald-400" />,
      iconBg: "bg-emerald-500/10",
      description: (
        <div className="flex items-center text-emerald-500 text-xs mt-1 font-medium">
          <ArrowUp className="size-3 mr-1" />
          Growing
        </div>
      ),
    },
    {
      title: "TEACHERS",
      value: stats?.users.teachers.toString() || "0",
      icon: <GraduationCap className="size-4 text-zinc-400" />,
      iconBg: "bg-white/5",
      description: <div className="text-zinc-500 text-xs mt-1">Active educators</div>,
    },
    {
      title: "PENDING REVIEW",
      value: (stats?.tasks.submitted || 0).toString(),
      icon: <Hourglass className="size-4 text-[var(--gold)]" />,
      iconBg: "bg-[var(--gold)]/10",
      description: (
        <div className="flex items-center text-[var(--gold)] text-xs mt-1 font-medium">
          <Flag className="size-3 mr-1" />
          Needs review
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
            <CardContent className="p-5 flex flex-col h-[140px] justify-between">
              <div>
                <Skeleton className="size-8 rounded-md mb-6 bg-white/5" />
                <Skeleton className="h-3 w-20 mb-2 bg-white/5" />
                <Skeleton className="h-10 w-16 bg-white/5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            {metric.description && <div>{metric.description}</div>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
