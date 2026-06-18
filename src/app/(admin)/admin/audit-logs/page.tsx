"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Terminal,
  User,
  Activity,
  Calendar,
  CheckCircle2,
  XCircle,
  Database,
  RefreshCw
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
import { DashboardHeader } from "@/components/dashboard-header";

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
  details?: any;
  request?: any;
  ipAddress?: string;
  _ipAddress?: string;
  createdAt?: string;
  _createdAt?: string;
}

interface ActionOption {
  key: string;
  value: string;
  category: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [actions, setActions] = useState<ActionOption[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter form states
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Active filters (sent to API)
  const [activeFilters, setActiveFilters] = useState({
    action: "",
    outcome: "",
    from: "",
    to: "",
  });

  const fetchActions = async () => {
    try {
      const res = await api.get('/admin/audit-logs/actions');
      const data = res.data.data ?? res.data;
      setActions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch audit actions:", err);
    }
  };

  const fetchLogs = async (filtersObj = activeFilters) => {
    try {
      setLoading(true);
      const params: any = {
        page: 1,
        limit: 100, // Load enough logs for premium list view
      };
      
      if (filtersObj.action) params.action = filtersObj.action;
      if (filtersObj.outcome) params.outcome = filtersObj.outcome;
      if (filtersObj.from) params.from = filtersObj.from;
      if (filtersObj.to) params.to = filtersObj.to;
      
      const res = await api.get('/admin/audit-logs', { params });
      const data = res.data.data.logs || res.data.data;
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
    fetchLogs();
  }, []);

  const handleApplyFilter = () => {
    const newFilters = {
      action: selectedAction,
      outcome: selectedOutcome,
      from: selectedFrom,
      to: selectedTo,
    };
    setActiveFilters(newFilters);
    fetchLogs(newFilters);
  };

  const handleClearFilter = () => {
    setSelectedAction("");
    setSelectedOutcome("");
    setSelectedFrom("");
    setSelectedTo("");
    setSearchQuery("");
    
    const cleared = {
      action: "",
      outcome: "",
      from: "",
      to: "",
    };
    setActiveFilters(cleared);
    fetchLogs(cleared);
  };

  // Group actions by category dynamically
  const groupedActions = actions.reduce((acc, curr) => {
    const cat = curr.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(curr);
    return acc;
  }, {} as Record<string, ActionOption[]>);

  // Client-side search filters based on requester email, ID or action
  const filteredLogs = logs.filter(log => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const actionVal = (log.action || log._action || "").toLowerCase();
    const actorEmail = (log.requesterEmail || log._requesterEmail || log.actorLabel || log._actorLabel || "").toLowerCase();
    const actorId = (log.requesterId || log._requesterId || "").toLowerCase();
    const ip = (log.request?.ip || log.ipAddress || log._ipAddress || "").toLowerCase();

    return actionVal.includes(query) || actorEmail.includes(query) || actorId.includes(query) || ip.includes(query);
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

  const renderDetails = (details: any) => {
    if (!details || typeof details !== 'object' || Object.keys(details).length === 0) return "—";
    const { requesterId, ...rest } = details;
    const entries = Object.entries(rest).filter(([, v]) => v !== null && v !== undefined);
    if (entries.length === 0) return "—";
    return (
      <div className="flex flex-col gap-0.5 text-xs text-zinc-400">
        {entries.map(([k, v]) => (
          <span key={k} className="block">
            <span className="font-semibold text-zinc-300">{k}:</span> {String(v)}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <DashboardHeader
        title="Audit Logs"
        breadcrumbs={[
          { label: "Admin" },
          { label: "Security & Logs" }
        ]}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => fetchLogs()} 
          disabled={loading}
          className="text-zinc-400 hover:text-white size-9 rounded-lg border border-white/10 bg-[#1a211e] cursor-pointer animate-none"
        >
          <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
        <Button variant="outline" className="bg-[#1a211e] border-white/10 text-zinc-400 hover:text-white gap-2 h-9">
          <Database className="size-4" />
          Export Logs
        </Button>
      </DashboardHeader>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Sub-header context */}
          <div className="flex items-center justify-between">
            <div className="text-[12px] text-zinc-500 font-mono tracking-wide uppercase">
              Every admin action recorded with actor, target, and timestamp
            </div>
            <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400 font-bold tracking-wider px-3 py-1">
              ADMIN
            </Badge>
          </div>

          {/* Filter Logs Card (Direct replica of premium dark design) */}
          <div className="bg-[#1a211e] border border-white/5 rounded-xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-white/5 bg-[#151b18]">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Filter logs</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-end gap-5">
                
                {/* ACTION Filter */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Action</label>
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-[240px] focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="">All actions</option>
                    {Object.entries(groupedActions).map(([cat, items]) => {
                      const label = cat.charAt(0).toUpperCase() + cat.slice(1);
                      return (
                        <optgroup key={cat} label={label} className="bg-[#111614] text-zinc-500">
                          {items.map((item) => (
                            <option key={item.key} value={item.value} className="text-zinc-200">
                              {item.key.toLowerCase().replace(/_/g, ' ')}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                </div>

                {/* OUTCOME Filter */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Outcome</label>
                  <select
                    value={selectedOutcome}
                    onChange={(e) => setSelectedOutcome(e.target.value)}
                    className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-[140px] focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="">All</option>
                    <option value="success">Success</option>
                    <option value="failure">Failure</option>
                  </select>
                </div>

                {/* FROM Filter */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">From</label>
                  <input
                    type="date"
                    value={selectedFrom}
                    onChange={(e) => setSelectedFrom(e.target.value)}
                    className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-[160px] focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer [color-scheme:dark]"
                  />
                </div>

                {/* TO Filter */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">To</label>
                  <input
                    type="date"
                    value={selectedTo}
                    onChange={(e) => setSelectedTo(e.target.value)}
                    className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-[160px] focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer [color-scheme:dark]"
                  />
                </div>

                {/* Apply / Clear Buttons */}
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={handleApplyFilter}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-6 rounded-lg font-semibold text-sm transition-all cursor-pointer"
                  >
                    Apply
                  </Button>
                  <Button 
                    onClick={handleClearFilter}
                    variant="outline"
                    className="bg-transparent border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white h-10 px-5 rounded-lg text-sm transition-all cursor-pointer"
                  >
                    Clear
                  </Button>
                </div>

              </div>
            </div>
          </div>

          {/* Controls - Search Input */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <Input 
                placeholder="Search by action, email, requester ID, or IP..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-[#1a211e] border-white/10 text-sm h-10 focus-visible:ring-1 focus-visible:ring-emerald-500 placeholder:text-zinc-600 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#1a211e] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#151b18]">
              <h2 className="text-sm font-bold text-white tracking-tight">Log entries</h2>
              <span className="text-xs text-zinc-500 font-semibold font-mono bg-[#111614] px-2.5 py-1 rounded-full border border-white/5">
                {filteredLogs.length} entries
              </span>
            </div>
            
            <Table>
              <TableHeader className="bg-[#151b18]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4 pl-6">Timestamp</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Action</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Outcome</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Actor</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4">Details</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-4 text-right pr-6">IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i} className="border-white/5">
                      <TableCell className="pl-6 py-4"><Skeleton className="h-4 w-32 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 bg-white/5 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-56 bg-white/5" /></TableCell>
                      <TableCell className="text-right pr-6"><Skeleton className="h-4 w-24 ml-auto bg-white/5" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredLogs.length === 0 ? (
                  <TableRow key="empty">
                    <TableCell colSpan={6} className="py-20 text-center">
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
                          <Activity className="size-3.5 text-emerald-400" />
                          <span className="text-xs font-mono bg-zinc-800/40 text-zinc-300 border border-white/5 px-2 py-0.5 rounded">
                            {log.action || log._action}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getOutcomeBadge(log.outcome || log._outcome || "")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
                            <User className="size-3.5 text-zinc-500" />
                            {log.requesterEmail || log._requesterEmail || log.actorLabel || log._actorLabel || "System"}
                          </div>
                          {log.requesterId && (
                            <span className="text-[10px] text-zinc-600 font-mono pl-5">ID: {log.requesterId || log._requesterId}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        {renderDetails(log.details)}
                      </TableCell>
                      <TableCell className="text-right pr-6 text-xs font-mono text-zinc-500">
                        {log.request?.ip || log.ipAddress || log._ipAddress || "—"}
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
