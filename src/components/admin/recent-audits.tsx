"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlignLeft, ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";

interface AuditLog {
  _id?: string;
  id?: string;
  createdAt?: string;
  _createdAt?: string;
  action?: string;
  _action?: string;
  outcome?: string;
  _outcome?: string;
  requesterId?: string;
  _requesterId?: string;
}

export function RecentAuditsSection() {
  const [auditEvents, setAuditEvents] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/audit-logs?limit=8');
      const logs = res.data.data.logs || res.data.data;
      setAuditEvents(Array.isArray(logs) ? logs : []);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getActorId = (id?: string) => {
    if (!id) return "—";
    return id.substring(0, 8); // Display short ID
  };

  return (
    <Card className="bg-[#1a211e] border-white/5 rounded-xl mt-4 shadow-none overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <AlignLeft className="size-4 text-zinc-400" />
          <CardTitle className="text-sm font-semibold text-white">Recent audit events</CardTitle>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchLogs}
            disabled={loading}
            className="h-8 bg-transparent border-white/10 text-zinc-300 hover:text-white hover:bg-white/10"
          >
            <RefreshCw className={`size-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href="/admin/audit-logs" className="text-xs text-blue-400 flex items-center hover:text-blue-300 transition-colors">
            View all <ArrowRight className="size-3 ml-1" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-2">
        <Table>
          <TableHeader className="bg-[#151b18]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3 pl-6">Time</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Action</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Result</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3 pr-6">Actor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-white/5 hover:bg-white/5">
                  <TableCell className="py-3 pl-6"><Skeleton className="h-4 w-32 bg-white/5" /></TableCell>
                  <TableCell className="py-3"><Skeleton className="h-5 w-24 bg-white/5 rounded" /></TableCell>
                  <TableCell className="py-3"><Skeleton className="h-5 w-12 bg-white/5 rounded-full" /></TableCell>
                  <TableCell className="py-3 pr-6"><Skeleton className="h-4 w-16 bg-white/5" /></TableCell>
                </TableRow>
              ))
            ) : auditEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-zinc-500 text-sm">No recent audit events</TableCell>
              </TableRow>
            ) : (
              auditEvents.map((event, i) => {
                const action = event.action || event._action || "unknown_action";
                const outcome = event.outcome || event._outcome || "UNKNOWN";
                const isSuccess = outcome.toLowerCase() === "success" || outcome.toLowerCase() === "ok";
                
                return (
                  <TableRow key={event.id || event._id || i} className="border-white/5 hover:bg-white/5">
                    <TableCell className="text-zinc-400 text-xs py-3 pl-6">
                      {formatDate(event.createdAt || event._createdAt)}
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="bg-white/5 border border-white/5 text-zinc-300 font-mono text-[10px] px-2 py-1 rounded">
                        {action}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant={isSuccess ? 'default' : 'destructive'} className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 ${
                        isSuccess 
                          ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                          : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                      }`}>
                        {isSuccess ? 'OK' : 'FAIL'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400 font-mono text-xs py-3 pr-6">
                      {getActorId(event.requesterId || event._requesterId)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
