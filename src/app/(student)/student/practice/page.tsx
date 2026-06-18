"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, PenTool, Clock, ChevronRight, Filter } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard-header";

export default function PracticePage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/writing-tasks');
        setTasks(response.data.data.items || response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = (task.title || task._title || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || (task.taskType || task._taskType) === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Writing Practice"
        titleClassName="text-2xl font-serif"
        description="Select a task to begin your simulation."
      />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <Input 
                placeholder="Search tasks..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-[#1a211e] border-white/10 text-sm h-11 focus-visible:ring-1 focus-visible:ring-gold rounded-xl text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={typeFilter === 'all' ? 'default' : 'outline'} 
                onClick={() => setTypeFilter('all')}
                className={typeFilter === 'all' ? 'bg-gold text-slate-900 hover:bg-gold-light' : 'border-white/10 text-zinc-400'}
              >
                All
              </Button>
              <Button 
                variant={typeFilter === 'TASK_1' ? 'default' : 'outline'} 
                onClick={() => setTypeFilter('TASK_1')}
                className={typeFilter === 'TASK_1' ? 'bg-gold text-slate-900 hover:bg-gold-light' : 'border-white/10 text-zinc-400'}
              >
                Task 1
              </Button>
              <Button 
                variant={typeFilter === 'TASK_2' ? 'default' : 'outline'} 
                onClick={() => setTypeFilter('TASK_2')}
                className={typeFilter === 'TASK_2' ? 'bg-gold text-slate-900 hover:bg-gold-light' : 'border-white/10 text-zinc-400'}
              >
                Task 2
              </Button>
            </div>
          </div>

          {/* Task Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-[#1a211e] border-white/5 rounded-2xl overflow-hidden shadow-none">
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 bg-white/5 mb-4" />
                    <Skeleton className="h-4 w-1/2 bg-white/5 mb-8" />
                    <Skeleton className="h-10 w-full bg-white/5 rounded-xl" />
                  </CardContent>
                </Card>
              ))
            ) : filteredTasks.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <PenTool className="size-8 text-zinc-600" />
                </div>
                <h3 className="text-xl font-semibold text-white">No tasks found</h3>
                <p className="text-zinc-500 mt-2">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <Card key={task.id || task._id} className="bg-[#1a211e] border-white/5 rounded-2xl overflow-hidden shadow-none hover:border-gold/30 transition-all group flex flex-col h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`${(task.taskType || task._taskType) === 'TASK_1' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'} border-none px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase`}>
                        {task.taskType || task._taskType}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                        <Clock className="size-3" />
                        {(task.taskType || task._taskType) === 'TASK_1' ? '20 mins' : '40 mins'}
                      </div>
                    </div>
                    <CardTitle className="text-lg text-white font-serif leading-snug group-hover:text-gold transition-colors">
                      {task.title || task._title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <CardDescription className="text-zinc-500 text-sm line-clamp-2 mb-6">
                      {task.prompt || "Practice your IELTS writing skills with this specialized task. Receive feedback and band scores."}
                    </CardDescription>
                    <Link href={`/student/writing/${task.id || task._id}`}>
                      <Button className="w-full bg-white/5 border border-white/10 hover:bg-gold hover:text-slate-900 hover:border-gold text-white font-semibold transition-all rounded-xl h-11 flex items-center justify-center gap-2">
                        Start Simulation <ChevronRight className="size-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
