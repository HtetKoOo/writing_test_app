"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";

// Mock Data for Line Chart (backend doesn't provide time-series yet)
const signupData = [
  { date: "Apr 15", signups: 2 },
  { date: "Apr 16", signups: 8 },
  { date: "Apr 17", signups: 10 },
  { date: "Apr 18", signups: 9 },
  { date: "Apr 19", signups: 12 },
  { date: "Apr 20", signups: 10 },
  { date: "Apr 21", signups: 5 },
  { date: "Apr 22", signups: 1 },
  { date: "Apr 23", signups: 3 },
  { date: "Apr 24", signups: 11 },
  { date: "Apr 25", signups: 12 },
  { date: "Apr 26", signups: 8 },
  { date: "Apr 27", signups: 4 },
  { date: "Apr 28", signups: 10 },
  { date: "Apr 29", signups: 8 },
  { date: "Apr 30", signups: 4 },
  { date: "May 1", signups: 3 },
  { date: "May 2", signups: 5 },
  { date: "May 3", signups: 7 },
  { date: "May 4", signups: 6 },
  { date: "May 5", signups: 8 },
  { date: "May 6", signups: 12 },
  { date: "May 7", signups: 6 },
  { date: "May 8", signups: 2 },
  { date: "May 9", signups: 11 },
  { date: "May 10", signups: 8 },
  { date: "May 11", signups: 4 },
  { date: "May 12", signups: 6 },
  { date: "May 13", signups: 12 },
  { date: "May 14", signups: 3 },
];

export function ChartsSection() {
  const [roleData, setRoleData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        const users = response.data.data.users;
        
        const students = Math.max(0, users.total - users.admins - users.teachers);
        
        setRoleData([
          { name: "Students", value: students, color: "#3b82f6" }, // Blue
          { name: "Teachers", value: users.teachers, color: "#06b6d4" },  // Cyan
          { name: "Admins", value: users.admins, color: "#a855f7" },    // Purple
        ]);
      } catch (error) {
        console.error("Failed to fetch admin stats for charts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
      {/* Line Chart Card */}
      <Card className="bg-[#1a211e] border-white/5 rounded-xl lg:col-span-2 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white">New signups — last 30 days</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[250px] w-full mt-4 bg-white/5 rounded-lg" />
          ) : (
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={signupData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    dy={10}
                    interval={4}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    dx={-10}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111614', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="signups" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorSignups)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Donut Chart Card */}
      <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white">Users by role</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-between h-[250px]">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center gap-4">
              <Skeleton className="size-[150px] rounded-full bg-white/5" />
              <div className="flex flex-col gap-4">
                <Skeleton className="h-4 w-20 bg-white/5" />
                <Skeleton className="h-4 w-20 bg-white/5" />
                <Skeleton className="h-4 w-20 bg-white/5" />
              </div>
            </div>
          ) : (
            <>
              <div className="h-[180px] w-[180px] relative flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      stroke="none"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#111614', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-3 w-full pl-6 mt-4 xl:mt-0">
                {roleData.map((role, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full" style={{ backgroundColor: role.color }} />
                      <span className="text-xs text-zinc-300">{role.name}</span>
                    </div>
                    <span className="text-xs text-zinc-500">{role.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
