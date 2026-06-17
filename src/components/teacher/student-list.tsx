"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Student {
  id: string;
  _id?: string;
  name: string;
  email: string;
  initial?: string;
  taskStats?: {
    total: number;
    pending: number;
  };
}

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/teacher/students?stats=true');
        setStudents(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-zinc-400" />
          <CardTitle className="text-sm font-semibold text-white">Your Students</CardTitle>
        </div>
        <Link href="/teacher/assign" className="text-xs text-zinc-400 flex items-center hover:text-white transition-colors">
          + Assign task <ArrowRight className="size-3 ml-1" />
        </Link>
      </CardHeader>
      <CardContent className="mt-2">
        <div className="flex flex-col gap-0">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-4">
                  <Skeleton className="size-10 rounded-full bg-white/5" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32 bg-white/5" />
                    <Skeleton className="h-3 w-48 bg-white/5" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24 bg-white/5" />
              </div>
            ))
          ) : students.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-sm">No students found</div>
          ) : (
            students.map((student, i) => (
              <div key={student.id || student._id || i} className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-white/5 last:border-0 gap-4 sm:gap-0">
                <div className="flex items-center gap-4">
                  <Avatar className="size-10 border border-white/10">
                    <AvatarFallback className="bg-[#ebd48c] text-[#544321] font-bold">
                      {getInitial(student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-zinc-200 leading-none">{student.name}</span>
                    <span className="text-xs text-zinc-500">{student.email}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-400 text-[10px] px-2 py-0">
                        {student.taskStats?.total || 0} tasks
                      </Badge>
                      <Badge variant="outline" className="border-[var(--gold)]/20 bg-[var(--gold)]/10 text-[var(--gold)] text-[10px] px-2 py-0">
                        {student.taskStats?.pending || 0} pending
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/teacher/students?studentId=${student.id || student._id}`}>
                    <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 h-8 text-xs font-semibold px-4 rounded-md">
                      Profile
                    </Button>
                  </Link>
                  <Link href={`/teacher/student-tasks/${student.id || student._id}`}>
                    <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 h-8 text-xs font-semibold px-4 rounded-md">
                      Tasks
                    </Button>
                  </Link>
                  <Link href={`/teacher/assign?studentId=${student.id || student._id}`}>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs font-semibold px-4 rounded-md">
                      + Assign
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
