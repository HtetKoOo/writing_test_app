import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";

const students = [
  { name: "John", email: "john@example.com", initial: "J", tasks: 6, pending: 6 },
  { name: "John Doe", email: "johndoe@gmail.com", initial: "J", tasks: 7, pending: 7 },
  { name: "Donkey", email: "donkey@gmail.com", initial: "D", tasks: 2, pending: 2 },
];

export function StudentList() {
  return (
    <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-amber-500/10 flex items-center justify-center">
            <span className="text-[10px]">👨‍🎓</span>
          </div>
          <CardTitle className="text-sm font-semibold text-white">Your Students</CardTitle>
        </div>
        <Link href="/teacher/assign" className="text-xs text-blue-400 flex items-center hover:text-blue-300 transition-colors">
          + Assign task <ArrowRight className="size-3 ml-1" />
        </Link>
      </CardHeader>
      <CardContent className="mt-2">
        <div className="flex flex-col gap-0">
          {students.map((student, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-white/5 last:border-0 gap-4 sm:gap-0">
              <div className="flex items-center gap-4">
                <Avatar className="size-10 border border-white/10">
                  <AvatarFallback className="bg-[#4d6a45] text-white font-bold">{student.initial}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-zinc-200 leading-none">{student.name}</span>
                  <span className="text-xs text-zinc-500">{student.email}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-400 text-[10px] px-2 py-0">
                      {student.tasks} tasks
                    </Badge>
                    <Badge variant="outline" className="border-[var(--gold)]/20 bg-[var(--gold)]/10 text-[var(--gold)] text-[10px] px-2 py-0">
                      {student.pending} pending
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 h-8">
                  View tasks
                </Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8">
                  + Assign task
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
