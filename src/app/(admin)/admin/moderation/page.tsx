"use client";

import React, { useEffect, useState } from "react";
import { 
  Flag, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  ShieldAlert,
  Calendar,
  ExternalLink
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";

interface FlagItem {
  id?: string;
  _id?: string;
  taskId?: string;
  _taskId?: string;
  reason?: string;
  _reason?: string;
  status?: string;
  _status?: string;
  severity?: string;
  _severity?: string;
  createdAt?: string;
  _createdAt?: string;
  flaggedBy?: string;
  _flaggedBy?: string;
}

export default function ModerationPage() {
  const [flags, setFlags] = useState<FlagItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlags = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/flags');
      // The backend returns { flags: [], total, ... }
      const data = res.data.data.flags || res.data.data;
      setFlags(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch flags:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Moderation Queue</h1>
          <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
            <span>Admin</span>
            <span>›</span>
            <span className="text-zinc-400">Moderation</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-400 font-semibold py-1 px-3 gap-2">
             <ShieldAlert className="size-3" />
             {flags.filter(f => f.status === 'open' || f.status === 'OPEN').length} Open Flags
           </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" className="bg-[#1a211e] border-white/10 text-zinc-400 hover:text-white h-10 px-4 gap-2">
                <Filter className="size-4" />
                All Status
              </Button>
              <Button variant="outline" className="bg-[#1a211e] border-white/10 text-zinc-400 hover:text-white h-10 px-4 gap-2">
                <AlertTriangle className="size-4" />
                Severity
              </Button>
            </div>
            <Button variant="ghost" onClick={fetchFlags} className="text-zinc-500 hover:text-white">Refresh Queue</Button>
          </div>

          {/* Table Container */}
          <div className="bg-[#1a211e] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <Table>
              <TableHeader className="bg-[#151b18]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4 pl-6">Content ID</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Reason</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Severity</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Status</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Reported At</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-white/5">
                      <TableCell className="pl-6 py-4"><Skeleton className="h-4 w-32 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 bg-white/5 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 bg-white/5 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 bg-white/5" /></TableCell>
                      <TableCell className="text-right pr-6"><Skeleton className="size-8 ml-auto bg-white/5" /></TableCell>
                    </TableRow>
                  ))
                ) : flags.length === 0 ? (
                  <TableRow key="empty">
                    <TableCell colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-zinc-500">
                        <CheckCircle className="size-12 text-emerald-500/20" />
                        <p>No flags found in the queue.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  flags.map((flag, idx) => (
                    <TableRow key={flag.id || flag._id || idx} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-500 truncate w-24">{flag.taskId || flag._taskId}</span>
                          <Button variant="ghost" size="icon" className="size-6 text-zinc-600 hover:text-blue-400">
                            <ExternalLink className="size-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="size-3.5 text-zinc-600" />
                          <span className="text-sm text-zinc-300">{flag.reason || flag._reason}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`
                          text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 border-0
                          ${(flag.severity || flag._severity) === 'high' || (flag.severity || flag._severity) === 'HIGH' ? 'bg-red-500/20 text-red-400' : 
                            (flag.severity || flag._severity) === 'medium' || (flag.severity || flag._severity) === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 
                            'bg-blue-500/20 text-blue-400'}
                        `}>
                          {flag.severity || flag._severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`
                          text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 border-0
                          ${(flag.status || flag._status) === 'open' || (flag.status || flag._status) === 'OPEN' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}
                        `}>
                          {flag.status || flag._status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-3.5 text-zinc-600" />
                          {formatDate(flag.createdAt || flag._createdAt || "")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-[#1a211e] border-white/10 text-zinc-300 shadow-2xl">
                            <DropdownMenuLabel className="text-xs text-zinc-500 uppercase tracking-widest px-3 py-2">Moderation</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem className="gap-3 px-3 py-2 hover:bg-white/5 focus:bg-white/5 cursor-pointer text-emerald-400">
                              <CheckCircle className="size-4" /> Resolve Flag
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 px-3 py-2 hover:bg-white/5 focus:bg-white/5 cursor-pointer text-red-400">
                              <ShieldAlert className="size-4" /> Delete Content
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
