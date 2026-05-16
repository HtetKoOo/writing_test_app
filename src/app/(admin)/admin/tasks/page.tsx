"use client";

import React, { useEffect, useState } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileEdit,
  User
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";

interface Task {
  id: string;
  _id?: string;
  title: string;
  status: string;
  taskType: string;
  bandScore: number | null;
  updatedAt: string;
  userId: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/writing-tasks');
      setTasks(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => 
    task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="size-3" />;
      case 'SUBMITTED': return <Clock className="size-3" />;
      case 'SCORED': return <CheckCircle2 className="size-3" />;
      default: return <AlertCircle className="size-3" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Writing Tasks</h1>
          <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
            <span>Admin</span>
            <span>›</span>
            <span className="text-zinc-400">Tasks</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="bg-white/5 border-white/10 text-zinc-400 font-normal py-1 px-3">
             Total: {tasks.length}
           </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <Input 
                placeholder="Search by title or task ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-[#1a211e] border-white/10 text-sm h-10 focus-visible:ring-1 focus-visible:ring-[var(--gold)] placeholder:text-zinc-600 rounded-lg text-white"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" className="bg-[#1a211e] border-white/10 text-zinc-400 hover:text-white h-10 px-4 gap-2">
                <Filter className="size-4" />
                Status
              </Button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#1a211e] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <Table>
              <TableHeader className="bg-[#151b18]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4 pl-6">Task Title</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Type</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Status</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Band</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Last Updated</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-white/5">
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-64 bg-white/5" />
                          <Skeleton className="h-3 w-32 bg-white/5" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-5 w-16 bg-white/5 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24 bg-white/5 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32 bg-white/5" /></TableCell>
                      <TableCell className="text-right pr-6"><Skeleton className="size-8 ml-auto bg-white/5" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredTasks.length === 0 ? (
                  <TableRow key="empty">
                    <TableCell colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-zinc-500">
                        <FileText className="size-12 opacity-20" />
                        <p>No tasks found matching your search</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task, idx) => (
                    <TableRow key={task.id || task._id || idx} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">{task.title}</span>
                          <span className="text-[10px] text-zinc-500 font-mono tracking-tighter mt-0.5">ID: {task.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-medium text-zinc-400">{task.taskType}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`
                          text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 border-0 gap-1.5
                          ${task.status === 'COMPLETED' || task.status === 'SCORED' ? 'bg-emerald-500/10 text-emerald-400' : 
                            task.status === 'SUBMITTED' ? 'bg-[var(--gold)]/10 text-[var(--gold)]' : 
                            'bg-blue-500/10 text-blue-400'}
                        `}>
                          {getStatusIcon(task.status)}
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-bold text-zinc-300">
                        {task.bandScore !== null ? task.bandScore : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">
                        {formatDate(task.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-[#1a211e] border-white/10 text-zinc-300 shadow-2xl">
                            <DropdownMenuLabel className="text-xs text-zinc-500 uppercase tracking-widest px-3 py-2">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem className="gap-3 px-3 py-2 hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                              <Eye className="size-4 text-zinc-400" /> View Content
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 px-3 py-2 hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                              <FileEdit className="size-4 text-zinc-400" /> Review / Score
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem className="gap-3 px-3 py-2 hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                              <User className="size-4 text-zinc-400" /> View Author
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
