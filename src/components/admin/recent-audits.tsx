"use client";

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

const auditEvents = [
  { time: "14 May at 15:18:02", action: "auth.login", result: "OK", actor: "a1b68186" },
  { time: "14 May at 15:18:02", action: "auth.login", result: "OK", actor: "a1b68186" },
  { time: "14 May at 14:29:15", action: "auth.token.refresh_failed", result: "FAIL", actor: "—" },
  { time: "14 May at 14:29:08", action: "auth.token.refresh_failed", result: "FAIL", actor: "—" },
  { time: "14 May at 14:27:34", action: "auth.token.refresh_failed", result: "FAIL", actor: "—" },
  { time: "14 May at 14:27:34", action: "auth.login", result: "OK", actor: "a1b68186" },
  { time: "14 May at 14:27:34", action: "auth.login", result: "OK", actor: "a1b68186" },
  { time: "14 May at 14:26:33", action: "auth.token.refresh_failed", result: "FAIL", actor: "—" },
];

export function RecentAuditsSection() {
  return (
    <Card className="bg-[#1a211e] border-white/5 rounded-xl mt-4 shadow-none overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <AlignLeft className="size-4 text-zinc-400" />
          <CardTitle className="text-sm font-semibold text-white">Recent audit events</CardTitle>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="h-8 bg-transparent border-white/10 text-zinc-300 hover:text-white hover:bg-white/10">
            <RefreshCw className="size-3 mr-2" />
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
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Time</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Action</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Result</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Actor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditEvents.map((event, i) => (
              <TableRow key={i} className="border-white/5 hover:bg-white/5">
                <TableCell className="text-zinc-400 text-xs py-3">{event.time}</TableCell>
                <TableCell className="py-3">
                  <span className="bg-white/5 border border-white/5 text-zinc-300 font-mono text-[10px] px-2 py-1 rounded">
                    {event.action}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant={event.result === 'OK' ? 'default' : 'destructive'} className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 ${
                    event.result === 'OK' 
                      ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                      : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                  }`}>
                    {event.result}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-400 font-mono text-xs py-3">{event.actor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
