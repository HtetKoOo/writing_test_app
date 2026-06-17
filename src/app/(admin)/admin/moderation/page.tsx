"use client";

import React, { useEffect, useState } from "react";
import { 
  CheckCircle,
  MessageSquare,
  ShieldAlert,
  Calendar,
  ExternalLink,
  MoreVertical
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
import Link from "next/link";
import api from "@/lib/api";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";

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

  // Manual Flag Creation states
  const [flagTaskId, setFlagTaskId] = useState("");
  const [flagSeverity, setFlagSeverity] = useState("medium");
  const [flagReason, setFlagReason] = useState("");
  const [submittingFlag, setSubmittingFlag] = useState(false);

  // Filter state (in the table header)
  const [statusFilter, setStatusFilter] = useState("open");

  const fetchFlags = async (status = statusFilter) => {
    try {
      setLoading(true);
      const params: any = {};
      if (status) params.status = status;

      const res = await api.get('/admin/flags', { params });
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

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    fetchFlags(val);
  };

  const handleCreateFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagTaskId.trim()) return;

    try {
      setSubmittingFlag(true);
      await api.post('/admin/flags', {
        taskId: flagTaskId.trim(),
        severity: flagSeverity,
        reason: flagReason.trim() || "Manual administrative flag",
      });
      setFlagTaskId("");
      setFlagReason("");
      setFlagSeverity("medium");
      fetchFlags(); // refresh the queue
    } catch (err) {
      console.error("Failed to create flag:", err);
    } finally {
      setSubmittingFlag(false);
    }
  };

  const handleResolveFlag = async (flagId: string) => {
    try {
      await api.post(`/admin/flags/${flagId}/resolve`);
      fetchFlags();
    } catch (err) {
      console.error("Failed to resolve flag:", err);
    }
  };

  const handleDeleteContent = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this submission's content? This is irreversible.")) return;
    try {
      await api.delete(`/admin/content/${taskId}`);
      fetchFlags();
    } catch (err) {
      console.error("Failed to delete content:", err);
    }
  };

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
      {/* Topbar/Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614] select-none">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden text-zinc-400 hover:text-white" />
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Content Moderation</h1>
            <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
              <span>Admin</span>
              <span>›</span>
              <span className="text-zinc-400">Content</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <NotificationDropdown />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Sub-header context */}
          <div className="flex items-center justify-between">
            <div className="text-[12px] text-zinc-500 font-mono tracking-wide">
              Flag, review, and remove inappropriate submissions
            </div>
            <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400 font-bold tracking-wider px-3 py-1">
              ADMIN
            </Badge>
          </div>

          {/* Flag a Submission Card */}
          <div className="bg-[#1a211e] border border-white/5 rounded-xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-white/5 bg-[#151b18]">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Flag a submission</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateFlag} className="flex flex-wrap items-end gap-5">
                
                {/* TASK ID Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Task ID</label>
                  <input
                    type="text"
                    required
                    value={flagTaskId}
                    onChange={(e) => setFlagTaskId(e.target.value)}
                    placeholder="MongoDB ObjectId..."
                    className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-[240px] focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-700"
                  />
                </div>

                {/* SEVERITY Select */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Severity</label>
                  <select
                    value={flagSeverity}
                    onChange={(e) => setFlagSeverity(e.target.value)}
                    className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-[140px] focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* REASON Input */}
                <div className="flex flex-col gap-2 flex-1 min-w-[240px]">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Reason</label>
                  <input
                    type="text"
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    placeholder="Describe the issue..."
                    className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-700"
                  />
                </div>

                {/* Flag content Button */}
                <Button 
                  type="submit"
                  disabled={submittingFlag}
                  className="bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-500/20 h-10 px-6 rounded-lg font-semibold text-sm transition-all cursor-pointer"
                >
                  {submittingFlag ? "Flagging..." : "Flag content"}
                </Button>

              </form>
            </div>
          </div>

          {/* Table Container Card (Flagged content) */}
          <div className="bg-[#1a211e] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#151b18]">
              <h2 className="text-sm font-bold text-white tracking-tight">Flagged content</h2>
              <div className="flex items-center gap-3">
                {/* Dropdown status selector */}
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-1.5 text-xs h-9 w-[150px] focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="open">Open flags</option>
                  <option value="resolved">Resolved</option>
                  <option value="">All</option>
                </select>
                {/* Refresh button */}
                <Button 
                  onClick={() => fetchFlags()} 
                  disabled={loading}
                  variant="outline"
                  className="bg-transparent border-white/10 text-zinc-400 hover:text-white text-xs px-4 h-9 rounded-lg cursor-pointer transition-all"
                >
                  Refresh
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader className="bg-[#151b18]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4 pl-6">Task</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Flagged by</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Reason</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Severity</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Status</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-white/5">
                      <TableCell className="pl-6 py-4"><Skeleton className="h-4 w-32 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 bg-white/5 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 bg-white/5 rounded-full" /></TableCell>
                      <TableCell className="text-right pr-6"><Skeleton className="size-8 ml-auto bg-white/5" /></TableCell>
                    </TableRow>
                  ))
                ) : flags.length === 0 ? (
                  <TableRow key="empty">
                    <TableCell colSpan={6} className="py-20 text-center">
                      <div className="text-zinc-500 text-sm">
                        No flags found.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  flags.map((flag, idx) => (
                    <TableRow key={flag.id || flag._id || idx} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-400 truncate w-24" title={flag.taskId || flag._taskId}>
                            {flag.taskId || flag._taskId}
                          </span>
                          <Button asChild variant="ghost" size="icon" className="size-6 text-zinc-600 hover:text-blue-400 cursor-pointer">
                            <Link href={`/admin/review/${flag.taskId || flag._taskId}`}>
                              <ExternalLink className="size-3" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-300 font-medium font-mono">
                        {flag.flaggedBy || flag._flaggedBy || "System"}
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
                          ${(flag.severity || flag._severity)?.toLowerCase() === 'high' ? 'bg-red-500/20 text-red-400' : 
                            (flag.severity || flag._severity)?.toLowerCase() === 'medium' ? 'bg-amber-500/20 text-amber-400' : 
                            'bg-blue-500/20 text-blue-400'}
                        `}>
                          {flag.severity || flag._severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`
                          text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 border-0
                          ${(flag.status || flag._status)?.toLowerCase() === 'open' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}
                        `}>
                          {flag.status || flag._status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-[#1a211e] border-white/10 text-zinc-300 shadow-2xl">
                            <DropdownMenuLabel className="text-xs text-zinc-500 uppercase tracking-widest px-3 py-2">Moderation</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem asChild className="gap-3 px-3 py-2 hover:bg-white/5 focus:bg-white/5 cursor-pointer text-zinc-300">
                              <Link href={`/admin/review/${flag.taskId || flag._taskId}`}>
                                <span className="flex items-center">
                                  <ExternalLink className="size-4 text-zinc-400 mr-2" /> View Content
                                </span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5" />
                            {(flag.status || flag._status)?.toLowerCase() === 'open' && (
                              <DropdownMenuItem 
                                onClick={() => handleResolveFlag(flag.id || flag._id || "")}
                                className="gap-3 px-3 py-2 hover:bg-white/5 focus:bg-white/5 cursor-pointer text-emerald-400"
                              >
                                <span className="flex items-center">
                                  <CheckCircle className="size-4 mr-2" /> Resolve Flag
                                </span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleDeleteContent(flag.taskId || flag._taskId || "")}
                              className="gap-3 px-3 py-2 hover:bg-white/5 focus:bg-white/5 cursor-pointer text-red-400"
                            >
                              <span className="flex items-center">
                                <ShieldAlert className="size-4 mr-2" /> Delete Content
                              </span>
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
