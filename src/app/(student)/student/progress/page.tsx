"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp, Target, Award, BookOpen } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get('/writing-tasks?status=SCORED');
        const tasks = response.data.data.items || response.data.data || [];
        
        // Map tasks to a progress chart format
        const chartData = tasks
          .filter((t: any) => t.bandScore || t._bandScore)
          .map((t: any, i: number) => ({
            name: `Task ${i + 1}`,
            score: parseFloat(t.bandScore || t._bandScore),
          }))
          .reverse(); // Show oldest to newest
          
        setData(chartData);
      } catch (error) {
        console.error("Failed to fetch progress data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#111614]">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Your Progress</h1>
          <p className="text-zinc-500 text-sm mt-1">Track your band score journey and writing stats.</p>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1000px] mx-auto space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#1a211e] border-white/5 rounded-2xl shadow-none p-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                  <TrendingUp className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Avg. Score</p>
                  <h3 className="text-2xl font-bold text-white">
                    {data.length > 0 ? (data.reduce((acc, curr) => acc + curr.score, 0) / data.length).toFixed(1) : "—"}
                  </h3>
                </div>
              </div>
            </Card>
            <Card className="bg-[#1a211e] border-white/5 rounded-2xl shadow-none p-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Target className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Highest</p>
                  <h3 className="text-2xl font-bold text-white">
                    {data.length > 0 ? Math.max(...data.map(d => d.score)).toFixed(1) : "—"}
                  </h3>
                </div>
              </div>
            </Card>
            <Card className="bg-[#1a211e] border-white/5 rounded-2xl shadow-none p-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Award className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Level</p>
                  <h3 className="text-2xl font-bold text-white">Intermediate</h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Chart Section */}
          <Card className="bg-[#1a211e] border-white/5 rounded-3xl shadow-none overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-bold text-white font-serif">Band Score History</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {loading ? (
                <Skeleton className="h-[300px] w-full bg-white/5 rounded-2xl" />
              ) : data.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
                  <div className="text-center">
                    <BookOpen className="size-10 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-500">Submit tasks and get them scored to see your progress chart.</p>
                  </div>
                </div>
              ) : (
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#71717a', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        domain={[0, 9]} 
                        ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#71717a', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111614', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }}
                        itemStyle={{ color: '#eab308' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#eab308" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
