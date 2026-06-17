"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft,
  BookOpen, 
  Award, 
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Save,
  PenTool,
  Calendar,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface Task {
  id: string;
  _id?: string;
  title: string;
  questionPrompt?: string;
  _questionPrompt?: string;
  submissionText?: string;
  _submissionText?: string;
  status: string;
  taskType: string;
  examType: string;
  wordCount?: number;
  _wordCount?: number;
  bandScore?: number | null;
  _bandScore?: number | null;
  feedback?: string;
  _feedback?: string;
  userId: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
}

export default function TaskReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [feedback, setFeedback] = useState("");
  const [bandScore, setBandScore] = useState("");
  const [savingReview, setSavingReview] = useState(false);
  const [savingScore, setSavingScore] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchTask = async () => {
    if (!id || id === "undefined" || id === "null") return;
    try {
      setLoading(true);
      const res = await api.get(`/writing-tasks/${id}`);
      const data = res.data.data ?? res.data;
      if (!data) throw new Error("Task not found");
      setTask(data);
      
      // Prefill fields
      const fb = data.feedback ?? data._feedback ?? "";
      const bs = data.bandScore ?? data._bandScore ?? "";
      setFeedback(fb);
      setBandScore(bs !== "" && bs !== null ? String(bs) : "");
    } catch (error: any) {
      console.error("Failed to fetch task details:", error);
      showToast(error?.response?.data?.message || "Failed to load task details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && id !== "undefined" && id !== "null") {
      fetchTask();
    }
  }, [id]);

  const handleSaveReview = async () => {
    if (!feedback.trim()) {
      showToast("Please enter feedback before saving the review", "error");
      return;
    }

    try {
      setSavingReview(true);
      await api.patch(`/admin/writing-tasks/${id}/review`, { feedback });
      showToast("Review feedback successfully saved!", "success");
      await fetchTask();
    } catch (error: any) {
      console.error("Failed to save review:", error);
      showToast(error?.response?.data?.message || "Failed to save review feedback", "error");
    } finally {
      setSavingReview(false);
    }
  };

  const handleSaveScore = async () => {
    const scoreVal = parseFloat(bandScore);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 9) {
      showToast("Band score must be a number between 0 and 9", "error");
      return;
    }

    try {
      setSavingScore(true);
      await api.patch(`/admin/writing-tasks/${id}/score`, { bandScore: scoreVal });
      showToast(`Band score of ${scoreVal} successfully saved!`, "success");
      await fetchTask();
    } catch (error: any) {
      console.error("Failed to save score:", error);
      showToast(error?.response?.data?.message || "Failed to save band score", "error");
    } finally {
      setSavingScore(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED": 
      case "SCORED": 
        return <CheckCircle2 className="size-4" />;
      case "SUBMITTED": 
        return <Clock className="size-4" />;
      default: 
        return <AlertCircle className="size-4" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "SCORED":
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "REVIEWED":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "SUBMITTED":
        return "bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen p-8 max-w-[1400px] mx-auto gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-8 bg-white/5 rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-48 bg-white/5" />
            <Skeleton className="h-4 w-32 bg-white/5" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Skeleton className="h-64 bg-white/5 rounded-xl" />
            <Skeleton className="h-96 bg-white/5 rounded-xl" />
          </div>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-48 bg-white/5 rounded-xl" />
            <Skeleton className="h-48 bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="size-16 text-red-500/50" />
        <h2 className="text-xl font-bold text-white">Task Not Found</h2>
        <Button onClick={() => router.push("/admin/review")} className="bg-[#1a211e] border border-white/10 text-zinc-300 hover:text-white">
          <ArrowLeft className="size-4 mr-2" /> Back to Queue
        </Button>
      </div>
    );
  }

  const title = task.title;
  const status = task.status;
  const prompt = task.questionPrompt ?? task._questionPrompt ?? "";
  const submission = task.submissionText ?? task._submissionText ?? "";
  const wordCount = task.wordCount ?? task._wordCount ?? 0;
  const bandScoreVal = task.bandScore ?? task._bandScore;
  const taskType = task.taskType;
  const examType = task.examType;

  const canReview = status === "SUBMITTED";
  const canScore = status === "REVIEWED";
  const isScored = status === "SCORED";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
          toastMsg.type === "success" 
            ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300" 
            : "bg-red-950/80 border-red-500/30 text-red-300"
        }`}>
          {toastMsg.type === "success" ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
          <span className="text-sm font-semibold">{toastMsg.text}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614]">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden text-zinc-400 hover:text-white" />
          <Button 
            onClick={() => router.push("/admin/review")} 
            variant="ghost" 
            size="icon" 
            className="size-9 rounded-lg bg-[#1a211e] border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              {title}
              <Badge variant="outline" className={`py-0.5 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${getStatusBadgeClass(status)}`}>
                {getStatusIcon(status)}
                {status}
              </Badge>
            </h1>
            <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1.5 mt-0.5">
              <span>Admin</span>
              <span>›</span>
              <span>Review Queue</span>
              <span>›</span>
              <span className="text-zinc-400">Detail</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isScored && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-4 rounded-xl">
              <Award className="size-5 text-emerald-400" />
              <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Final Score:</span>
              <span className="text-lg font-black text-emerald-400 font-mono">Band {bandScoreVal}</span>
            </div>
          )}
          <NotificationDropdown />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left panel: Prompt + Submission */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Prompt Card */}
            <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none overflow-hidden">
              <CardHeader className="bg-[#151b18] py-3.5 px-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-zinc-400" />
                    <CardTitle className="text-sm font-semibold text-white">Writing Prompt</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                    <span className="uppercase">{taskType}</span>
                    <span className="text-white/10">•</span>
                    <span className="uppercase">{examType}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {prompt || "No writing prompt provided for this task."}
                </p>
              </CardContent>
            </Card>

            {/* Submission Card */}
            <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none overflow-hidden">
              <CardHeader className="bg-[#151b18] py-3.5 px-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-zinc-400" />
                    <CardTitle className="text-sm font-semibold text-white">Student Submission</CardTitle>
                  </div>
                  {wordCount > 0 && (
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-zinc-400 py-0.5 px-2 text-xs font-mono font-normal">
                      {wordCount} words
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-[#121715] border border-white/5 rounded-lg p-5 font-serif text-zinc-100 text-base leading-loose whitespace-pre-wrap select-text min-h-[250px]">
                  {submission || "The student has not submitted any response yet."}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right panel: Controls & Actions */}
          <div className="flex flex-col gap-6">

            {/* Metadata Card */}
            <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-white">Task Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3.5 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-zinc-500">Student ID</span>
                  <span className="font-mono text-zinc-300">{task.userId}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-zinc-500">Last Updated</span>
                  <span className="text-zinc-300 flex items-center gap-1.5">
                    <Calendar className="size-3 text-zinc-500" />
                    {formatDate(task.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-zinc-500">Submitted At</span>
                  <span className="text-zinc-300">{formatDate(task.submittedAt || task.updatedAt)}</span>
                </div>
                {task.reviewedAt && (
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-zinc-500">Reviewed At</span>
                    <span className="text-zinc-300">{formatDate(task.reviewedAt)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Review Feedback Card */}
            <Card className={`border-white/5 rounded-xl shadow-none overflow-hidden transition-all duration-300 ${
              canReview ? "bg-[#1a211e] ring-1 ring-amber-500/10" : "bg-[#1a211e]/60"
            }`}>
              <CardHeader className="bg-[#151b18]/80 py-3.5 px-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-4 text-zinc-400" />
                  <CardTitle className="text-sm font-semibold text-white">Review Feedback</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex flex-col gap-4">
                {canReview ? (
                  <>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      Provide constructive analysis of grammar, task achievement, cohesion, and vocabulary.
                    </p>
                    <Textarea
                      placeholder="Write your feedback for the student..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[140px] bg-[#121715] border-white/10 text-sm focus-visible:ring-1 focus-visible:ring-amber-500 placeholder:text-zinc-600 rounded-lg text-white"
                    />
                    <Button 
                      onClick={handleSaveReview}
                      disabled={savingReview}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-2 px-4 shadow-lg shadow-amber-900/20"
                    >
                      <Save className="size-3.5 mr-2 animate-pulse" />
                      {savingReview ? "Saving Review..." : "Submit Review"}
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="bg-[#121715]/40 border border-white/5 rounded-lg p-4 text-sm text-zinc-400 min-h-[100px] leading-relaxed whitespace-pre-wrap">
                      {feedback || "No feedback has been saved yet."}
                    </div>
                    {status === "REVIEWED" && (
                      <Badge variant="outline" className="mx-auto bg-blue-500/5 border-blue-500/10 text-blue-400">
                        Review completed. Pending band score.
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Score Assignment Card */}
            {(canScore || isScored) && (
              <Card className={`border-white/5 rounded-xl shadow-none overflow-hidden transition-all duration-300 ${
                canScore ? "bg-[#1a211e] ring-1 ring-emerald-500/10" : "bg-[#1a211e]/60"
              }`}>
                <CardHeader className="bg-[#151b18]/80 py-3.5 px-6 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Award className="size-4 text-emerald-400" />
                    <CardTitle className="text-sm font-semibold text-white">Band Score Assignment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex flex-col gap-4">
                  {canScore ? (
                    <>
                      <p className="text-zinc-500 text-xs leading-relaxed">
                        Assign an official IELTS band score (e.g. 0 to 9, allowing 0.5 steps like 6.5 or 7.0).
                      </p>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          min="0"
                          max="9"
                          step="0.5"
                          placeholder="e.g. 6.5"
                          value={bandScore}
                          onChange={(e) => setBandScore(e.target.value)}
                          className="bg-[#121715] border-white/10 text-sm h-10 w-28 text-center font-bold text-white focus-visible:ring-1 focus-visible:ring-emerald-500"
                        />
                        <Button 
                          onClick={handleSaveScore}
                          disabled={savingScore}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10 shadow-lg shadow-emerald-900/20"
                        >
                          <Save className="size-3.5 mr-2" />
                          {savingScore ? "Saving..." : "Save Band Score"}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 border border-white/5 rounded-lg bg-[#121715]/40 gap-1.5">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Finalized Band Score</span>
                      <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight">Band {bandScoreVal}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
