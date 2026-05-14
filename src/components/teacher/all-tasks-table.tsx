"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

const tasksData = [
  { title: "Song Writing", student: "—", type: "TASK_2", status: "ASSIGNED", due: "21 Mar 2026" },
  { title: "Song Writing", student: "—", type: "TASK_2", status: "ASSIGNED", due: "21 Mar 2026" },
  { title: "Song Writing", student: "—", type: "TASK_2", status: "ASSIGNED", due: "21 Mar 2026" },
  { title: "Content writing", student: "—", type: "TASK_1", status: "ASSIGNED", due: "11 Apr 2026" },
  { title: "Content writing", student: "—", type: "TASK_1", status: "ASSIGNED", due: "11 Apr 2026" },
  { title: "Content writing", student: "—", type: "TASK_1", status: "ASSIGNED", due: "11 Apr 2026" },
  { title: "Black Berry", student: "—", type: "TASK_1", status: "SCORED", due: "28 Mar 2026" },
];

export function AllTasksTable() {
  return (
    <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none overflow-hidden mt-4">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <CardTitle className="text-sm font-semibold text-white">All Tasks</CardTitle>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
            <Input 
              placeholder="Search by title..." 
              className="pl-8 bg-transparent border-white/10 text-xs h-8 focus-visible:ring-1 focus-visible:ring-emerald-500 placeholder:text-zinc-600 rounded-md text-white"
            />
          </div>
          <select className="h-8 rounded-md border border-white/10 bg-transparent px-3 py-1 text-xs text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none pr-8 relative">
            <option value="all">All statuses</option>
            <option value="assigned">Assigned</option>
            <option value="scored">Scored</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-[#151b18]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Title</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Student</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Type</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Status</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3">Due</TableHead>
              <TableHead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasksData.map((task, i) => (
              <TableRow key={i} className="border-white/5 hover:bg-white/5">
                <TableCell className="font-semibold text-xs text-zinc-200 py-3">
                  {task.title}
                </TableCell>
                <TableCell className="text-zinc-500 text-xs py-3">{task.student}</TableCell>
                <TableCell className="text-zinc-400 font-mono text-xs py-3">{task.type}</TableCell>
                <TableCell className="py-3">
                  <Badge variant={task.status === 'SCORED' ? 'default' : 'secondary'} className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 ${
                    task.status === 'ASSIGNED' 
                      ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20' 
                      : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20'
                  }`}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-zinc-400 font-mono py-3">{task.due}</TableCell>
                <TableCell className="text-right py-3">
                  <Button variant="ghost" size="sm" className="h-7 text-[11px] font-semibold text-zinc-300 border border-white/10 hover:text-white hover:bg-white/10">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
