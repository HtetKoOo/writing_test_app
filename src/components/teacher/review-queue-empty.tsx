import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function ReviewQueueEmpty() {
  return (
    <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-zinc-400" />
          <CardTitle className="text-sm font-semibold text-white">Review Queue</CardTitle>
        </div>
        <span className="text-xs text-zinc-500 font-mono tracking-tight hidden sm:block">
          Submitted tasks waiting for your feedback
        </span>
      </CardHeader>
      <CardContent className="mt-2 flex flex-col items-center justify-center min-h-[200px] gap-2 pb-10">
        <div className="text-4xl mb-2">🎉</div>
        <h3 className="text-white font-bold text-lg">All clear!</h3>
        <p className="text-zinc-500 text-sm">No tasks waiting for review.</p>
      </CardContent>
    </Card>
  );
}
