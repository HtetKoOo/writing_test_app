"use client";

import React, { useEffect, useState } from "react";
import { 
  History, 
  Search, 
  Filter, 
  Terminal,
  User,
  Activity,
  Calendar,
  CheckCircle2,
  XCircle,
  Database
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";

interface AuditLog {
  id?: string;
  _id?: string;
  action?: string;
  _action?: string;
  requesterId?: string;
  _requesterId?: string;
  requesterEmail?: string;
  _requesterEmail?: string;
  actorLabel?: string;
  _actorLabel?: string;
  targetId?: string;
  _targetId?: string;
  outcome?: string;
  _outcome?: string;
  metadata?: any;
  _metadata?: any;
  ipAddress?: string;
  _ipAddress?: string;
  createdAt?: string;
  _createdAt?: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/audit-logs');
      // The backend returns { logs: [], total, ... }
      const data = res.data.data.logs || res.data.data;
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.requesterId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getOutcomeBadge = (outcome: string) => {
    const isSuccess = outcome?.toLowerCase() === 'success';
    return (
      <Badge className={`
        text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 border-0 gap-1
        ${isSuccess ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}
      `}>
        {isSuccess ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
        {outcome}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Audit Logs</h1>
          <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
            <span>Admin</span>
            <span>›</span>
            <span className="text-zinc-400">Security & Logs</span>
          </div>
        </div>
        <Button variant="outline" className="bg-[#1a211e] border-white/10 text-zinc-400 hover:text-white gap-2 h-9">
          <Database className="size-4" />
          Export Logs
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <Input 
                placeholder="Search by action or user ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-[#1a211e] border-white/10 text-sm h-10 focus-visible:ring-1 focus-visible:ring-emerald-500 placeholder:text-zinc-600 rounded-lg text-white"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" className="bg-[#1a211e] border-white/10 text-zinc-400 hover:text-white h-10 px-4 gap-2">
                <Filter className="size-4" />
                Action Type
              </Button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#1a211e] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <Table>
              <TableHeader className="bg-[#151b18]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4 pl-6">Timestamp</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Action</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Requester</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Outcome</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4 text-right pr-6">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i} className="border-white/5">
                      <TableCell className="pl-6 py-4"><Skeleton className="h-4 w-32 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 bg-white/5 rounded-full" /></TableCell>
                      <TableCell className="text-right pr-6"><Skeleton className="h-4 w-24 ml-auto bg-white/5" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredLogs.length === 0 ? (
                  <TableRow key="empty">
                    <TableCell colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-zinc-500">
                        <Terminal className="size-12 opacity-20" />
                        <p>No audit logs found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log, idx) => (
                    <TableRow key={log.id || log._id || idx} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Calendar className="size-3.5 text-zinc-600" />
                          {formatDate(log.createdAt || log._createdAt || "")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Activity className="size-3.5 text-blue-400" />
                          <span className="text-sm font-medium text-zinc-200">{log.action || log._action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 text-sm text-zinc-300 font-medium">
                            <User className="size-3.5 text-zinc-500" />
                            {log.requesterEmail || log._requesterEmail || log.actorLabel || log._actorLabel || "System"}
                          </div>
                          <span className="text-[10px] text-zinc-600 font-mono">ID: {log.requesterId || log._requesterId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getOutcomeBadge(log.outcome || log._outcome || "")}
                      </TableCell>
                      <TableCell className="text-right pr-6 text-xs font-mono text-zinc-500">
                        {log.ipAddress || log._ipAddress || "N/A"}
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
