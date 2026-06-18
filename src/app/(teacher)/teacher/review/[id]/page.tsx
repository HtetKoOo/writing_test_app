"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, MessageSquare, Award, BookOpen } from "lucide-react";
import api from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard-header";

interface TaskDetail {
  id: string;
  _id?: string;
  title: string;
  _title?: string;
  taskType: string;
  _taskType?: string;
  examType?: string;
  _examType?: string;
  status: string;
  _status?: string;
  wordCount?: number;
  _wordCount?: number;
  dueDate?: string;
  _dueDate?: string;
  questionPrompt?: string;
  _questionPrompt?: string;
  submissionText?: string;
  _submissionText?: string;
  feedback?: string;
  _feedback?: string;
  bandScore?: number;
  _bandScore?: number;
  score?: number;
  _score?: number;
  assignedTo?: {
    name?: string;
    email?: string;
  } | string;
}

export default function ReviewTaskPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [feedback, setFeedback] = useState("");
  const [bandScore, setBandScore] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/teacher/writing-tasks/${id}`);
      const taskData = response.data?.data ?? response.data;
      setTask(taskData);

      // Pre-fill editable states if already submitted
      setFeedback(taskData.feedback || taskData._feedback || "");
      const scoreVal = taskData.bandScore ?? taskData._bandScore ?? taskData.score ?? taskData._score;
      setBandScore(scoreVal != null ? String(scoreVal) : "");
    } catch (error) {
      console.error("Failed to load task:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      alert("Please enter feedback before saving.");
      return;
    }
    if (bandScore === "") {
      alert("Please enter a band score between 0 and 9.");
      return;
    }
    const scoreNum = Number(bandScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 9) {
      alert("Band score must be between 0 and 9.");
      return;
    }

    try {
      setSaving(true);
      await api.patch(`/teacher/writing-tasks/${id}/review`, {
        feedback: feedback.trim(),
        bandScore: scoreNum,
        score: scoreNum,
      });
      alert("Review successfully saved!");
      await fetchTask();
    } catch (error) {
      console.error("Failed to save review:", error);
      alert("Failed to save review.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#111614] text-zinc-500 gap-2">
        <div className="animate-spin size-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
        <p className="font-mono text-xs">Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#111614] text-zinc-500 gap-4">
        <p className="text-sm font-semibold">Writing task not found.</p>
        <Link href="/teacher">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const status = (task.status || task._status || "ASSIGNED").toUpperCase();
  const wordCount = task.wordCount ?? task._wordCount;
  const studentName =
    typeof task.assignedTo === "object"
      ? task.assignedTo.name || task.assignedTo.email
      : task.assignedTo || "—";

  const isSubmitted = status === "SUBMITTED";
  const isReviewed = status === "REVIEWED" || status === "SCORED";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      {/* Header */}
      <DashboardHeader
        title="Review Task"
        breadcrumbs={[
          { label: "Teacher" },
          { label: isSubmitted ? "Review Mode" : "View Mode" }
        ]}
        beforeTitle={
          <>
            <Link href="/teacher" className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
              <ArrowLeft className="size-3.5" /> Dashboard
            </Link>
            <span className="text-zinc-700 select-none">/</span>
          </>
        }
      >
        <Badge
          className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 border ${
            status === "ASSIGNED"
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : status === "SUBMITTED"
              ? "bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/20"
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          }`}
        >
          {status}
        </Badge>
      </DashboardHeader>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Card 1: Task Info */}
          <Card className="bg-[#1a211e] border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <CardHeader className="bg-[#151b18] border-b border-white/5 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base font-semibold text-white">{task.title || task._title || "Untitled"}</CardTitle>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-widest mt-1.5 uppercase">
                    {task.taskType || task._taskType || "TASK_1"} • {task.examType || task._examType || "GENERAL"}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Meta Grid */}
              <div className="grid grid-cols-3 gap-6 pb-6 border-b border-white/5 text-sm">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">Student</span>
                  <span className="text-zinc-200 font-medium">{studentName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">Words</span>
                  <span className="text-zinc-200 font-mono">{wordCount ? `${wordCount} words` : "—"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">Due Date</span>
                  <span className="text-zinc-200 font-mono">{formatDate(task.dueDate || task._dueDate)}</span>
                </div>
              </div>

              {/* Question Prompt */}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Question Prompt</label>
                <div className="bg-[#111614] border border-white/10 rounded-lg p-4 text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-[160px] overflow-y-auto">
                  {task.questionPrompt || task._questionPrompt || "No question prompt provided."}
                </div>
              </div>

              {/* Submission Box */}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Student Submission</label>
                <div className="bg-[#111614] border border-white/10 rounded-lg p-5 text-sm text-white whitespace-pre-wrap leading-loose font-serif max-h-[400px] overflow-y-auto min-h-[120px]">
                  {task.submissionText || task._submissionText || "No submission recorded yet."}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: EDITABLE FEEDBACK PANEL (shown when mode=review and status=SUBMITTED) */}
          {isSubmitted && (
            <Card className="bg-[#1a211e] border-white/5 rounded-xl overflow-hidden shadow-2xl animate-fadeIn">
              <CardHeader className="bg-[#151b18] border-b border-white/5 py-4">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="size-4 text-[var(--gold)]" /> Feedback & Score
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSaveReview} className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Your Feedback</label>
                    <textarea
                      required
                      rows={5}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Write detailed, actionable feedback for the student..."
                      className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-700 w-full min-h-[140px] resize-y leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Band Score (0–9)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={9}
                      step={0.5}
                      value={bandScore}
                      onChange={(e) => setBandScore(e.target.value)}
                      placeholder="e.g. 6.5"
                      className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-[140px] focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-700 font-mono font-bold"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-6 rounded-lg text-sm shadow-xl transition-all cursor-pointer"
                  >
                    {saving ? "Saving Review..." : "Save Review & Score"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Card 3: READ-ONLY SAVED REVIEW PANEL (shown when status is already reviewed) */}
          {isReviewed && (
            <Card className="bg-[#1a211e] border-white/5 rounded-xl overflow-hidden shadow-2xl animate-fadeIn">
              <CardHeader className="bg-[#151b18] border-b border-white/5 py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <Award className="size-4 text-emerald-400" /> Saved Review
                </CardTitle>
                <Badge className="bg-amber-500/10 text-[var(--gold)] border border-amber-500/20 text-sm font-mono font-extrabold px-3 py-1">
                  Band {task.bandScore ?? task._bandScore ?? task.score ?? task._score ?? "—"}
                </Badge>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block pl-0.5">Feedback Given</span>
                  <div className="bg-[#111614] border border-white/10 rounded-lg p-4 text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed min-h-[100px] opacity-80 select-all">
                    {feedback || "No feedback recorded yet."}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
}
