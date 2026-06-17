"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Check, Award, Clock, Users } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function TeacherMetricCards() {
  const [stats, setStats] = useState({
    awaiting: 0,
    reviewed: 0,
    scored: 0,
    activeAssignments: 0,
    students: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch tasks
        const tasksResponse = await api.get('/teacher/assigned-tasks');
        const tasksData = tasksResponse.data?.data;
        const tasks = Array.isArray(tasksData) ? tasksData : (tasksData?.tasks || tasksData?.items || []);
        
        // Fetch students
        const studentsResponse = await api.get('/teacher/students?stats=true');
        const studentsData = studentsResponse.data?.data || [];
        const studentCount = studentsData.length;

        const counts = tasks.reduce((acc: any, task: any) => {
          const status = task.status || task._status;
          if (status === 'SUBMITTED') acc.awaiting++;
          else if (status === 'REVIEWED') acc.reviewed++;
          else if (status === 'SCORED') acc.scored++;
          return acc;
        }, { awaiting: 0, reviewed: 0, scored: 0 });

        setStats({
          awaiting: counts.awaiting,
          reviewed: counts.reviewed,
          scored: counts.scored,
          activeAssignments: tasks.length, // total tasks assigned
          students: studentCount,
        });
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
      icon: <FileText className="size-5 text-[#c8a84b]" />,
      borderColor: "border-l-[#c8a84b]",
      badge: "NEEDS ATTENTION",
    },
    {
      title: "REVIEWED THIS ..",
      value: stats.reviewed.toString(),
      icon: <Check className="size-5 text-emerald-400" />,
      borderColor: "border-l-emerald-500",
    },
    {
      title: "SCORED",
      value: stats.scored.toString(),
      icon: <Award className="size-5 text-blue-400" />,
      borderColor: "border-l-blue-500",
    },
    {
      title: "ACTIVE ASSIGNM..",
      value: stats.activeAssignments.toString(),
      icon: <Clock className="size-5 text-violet-400" />,
      borderColor: "border-l-violet-500",
    },
    {
      title: "MY STUDENTS",
      value: stats.students.toString(),
      icon: <Users className="size-5 text-teal-400" />,
      borderColor: "border-l-teal-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
            <CardContent className="p-4 flex items-center h-[90px]">
              <div className="flex items-center gap-4 w-full">
                <Skeleton className="size-8 rounded bg-white/5" />
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton className="h-6 w-12 bg-white/5" />
                  <Skeleton className="h-3 w-20 bg-white/5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      {metrics.map((metric, i) => (
        <Card 
          key={i} 
          className={`bg-[#1a211e] border-white/5 rounded-xl shadow-none border-l-4 ${metric.borderColor} transition-all duration-200 hover:bg-[#222a26] hover:border-white/10 hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]`}
        >
          <CardContent className="p-2 flex items-center h-[60px]">
            <div className="flex items-center gap-2 w-full">
              {/* Icon Container */}
              <div className="flex size-10 items-center justify-center rounded-lg bg-black/10 shrink-0">
                {metric.icon}
              </div>
              
              {/* Content Container */}
              <div className="flex flex-col gap-0.5 min-w-0 leading-tight">
                <span className="text-2xl font-bold text-white tracking-tight leading-none">
                  {metric.value}
                </span>
                {metric.badge && (
                  <div className="mt-1">
                    <span className="text-[7.5px] font-bold text-[#c8a84b] bg-[#c8a84b]/10 border border-[#c8a84b]/20 px-1 py-0.5 rounded tracking-wide leading-none uppercase select-none">
                      {metric.badge}
                    </span>
                  </div>
                )}
                <span className="text-[8.5px] font-bold text-zinc-500 tracking-widest uppercase truncate mt-0.5">
                  {metric.title}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
