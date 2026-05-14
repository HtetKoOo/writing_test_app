"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const pendingQueue = [
  {
    title: "Happy",
    type: "TASK_1",
    date: "6 Mar at 01:57",
  },
  {
    title: "using chrome demo",
    type: "TASK_1",
    date: "7 Mar at 16:25",
  },
];

const recentActivity = [
  {
    title: "Evaporation",
    status: "ASSIGNED",
    band: "—",
    updated: "7 May at 21:45",
  },
  {
    title: "Air polution",
    status: "ASSIGNED",
    band: "—",
    updated: "7 May at 21:45",
  },
  {
    title: "Global warming effects",
    status: "COMPLETED",
    band: "6.5",
    updated: "7 May at 10:12",
  },
];

export function DataListsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
      {/* Pending Review Queue */}
      <Card className="bg-[#1a211e] border-white/5 rounded-xl lg:col-span-1 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-white">Pending review queue</CardTitle>
          <Link href="/admin/review" className="text-xs text-blue-400 flex items-center hover:text-blue-300 transition-colors">
            View all <ArrowRight className="size-3 ml-1" />
          </Link>
        </CardHeader>
        <CardContent className="mt-2">
          <div className="flex flex-col gap-0">
            {pendingQueue.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-200">{item.title}</span>
                  <span className="text-[10px] text-zinc-500 font-mono tracking-wider">
                    {item.type} • Submitted {item.date}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold)] h-8 px-3">
                  Review
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Table */}
      <Card className="bg-[#1a211e] border-white/5 rounded-xl lg:col-span-2 shadow-none overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white">Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-2">
          <Table>
            <TableHeader className="bg-[#151b18]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Title</TableHead>
                <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Status</TableHead>
                <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Band</TableHead>
                <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Updated</TableHead>
                <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity, i) => (
                <TableRow key={i} className="border-white/5 hover:bg-white/5">
                  <TableCell className="font-medium text-sm text-zinc-200 py-4">
                    {activity.title}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant={activity.status === 'COMPLETED' ? 'default' : 'secondary'} className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 ${
                      activity.status === 'ASSIGNED' 
                        ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    }`}>
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400 text-sm py-4">{activity.band}</TableCell>
                  <TableCell className="text-xs text-zinc-500 max-w-[80px] py-4">{activity.updated}</TableCell>
                  <TableCell className="text-right py-4">
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-400 border border-white/10 hover:text-white hover:bg-white/10">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
