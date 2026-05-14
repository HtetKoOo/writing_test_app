import { Card, CardContent } from "@/components/ui/card";
import { Check, Hourglass, Plus } from "lucide-react";

const metrics = [
  {
    title: "AWAITING REVIEW",
    value: "0",
    icon: <Hourglass className="size-4 text-[var(--gold)]" />,
    iconBg: "bg-[var(--gold)]/10",
  },
  {
    title: "REVIEWED",
    value: "0",
    icon: <Check className="size-4 text-blue-400" />,
    iconBg: "bg-blue-500/10",
  },
  {
    title: "SCORED",
    value: "1",
    icon: <Plus className="size-4 text-emerald-400" />,
    iconBg: "bg-emerald-500/10",
  },
];

export function TeacherMetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric, i) => (
        <Card key={i} className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
          <CardContent className="p-5 flex flex-col h-[140px] justify-between">
            <div>
              <div className={`size-8 rounded-md flex items-center justify-center mb-6 ${metric.iconBg}`}>
                {metric.icon}
              </div>
              <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-1">
                {metric.title}
              </p>
              <h3 className="text-4xl font-semibold text-white tracking-tight">
                {metric.value}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
