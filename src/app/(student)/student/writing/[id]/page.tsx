"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Download,
  BookOpen,
  Award,
  PenTool,
} from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard-header";

interface Task {
  id: string;
  title: string;
  description: string;
  questionPrompt?: string;
  status: string;
  taskType: string;
  examType: string;
  submissionText?: string;
  wordCount?: number;
  bandScore?: number;
  feedback?: string;
  dueDate?: string;
}

export default function WritingSimulationPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [essayText, setEssayText] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  // Time tracking references to avoid storage thrashing
  const lastSavedTimeRef = useRef<number>(0);

  // 1. Fetch Task Details on Mount
  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;
      try {
        setLoading(true);
        const res = await api.get(`/writing-tasks/${taskId}`);
        const fetchedTask = res.data?.data ?? res.data;
        setTask(fetchedTask);

        const status = (fetchedTask.status || "").toUpperCase();
        const isEditable = status === "ASSIGNED" || status === "WRITING";

        if (isEditable) {
          // Load draft from localStorage if present, fallback to task submissionText
          const savedDraft = localStorage.getItem(`essay_draft_${taskId}`);
          setEssayText(savedDraft ?? fetchedTask.submissionText ?? "");

          // Setup Timer: check if timer has a saved state in localStorage, else set standard durations
          const savedSeconds = localStorage.getItem(`essay_timer_${taskId}`);
          if (savedSeconds) {
            setRemainingSeconds(parseInt(savedSeconds, 10));
          } else {
            const defaultSeconds = fetchedTask.taskType === "TASK_1" ? 1200 : 2400; // 20 mins or 40 mins
            setRemainingSeconds(defaultSeconds);
          }
          setIsTimerActive(true);
        } else {
          // View Mode
          setEssayText(fetchedTask.submissionText || "");
          setIsTimerActive(false);
        }
      } catch (err: any) {
        console.error("Failed to fetch task detail:", err);
        setSubmitError("Failed to load task. Please return to practice list.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  // 2. Word Count calculation
  const wordCount = useMemo(() => {
    if (!essayText) return 0;
    return essayText.trim().split(/\s+/).filter(Boolean).length;
  }, [essayText]);

  // 3. Minimum word counts rules
  const minWordsRequired = useMemo(() => {
    if (!task) return 0;
    return task.taskType === "TASK_1" ? 150 : 250;
  }, [task]);

  const isWordCountMet = wordCount >= minWordsRequired;

  // 4. Timer Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          const nextSeconds = prev - 1;
          // Periodically sync remaining seconds to localStorage (every 10s)
          const now = Date.now();
          if (now - lastSavedTimeRef.current > 10000) {
            localStorage.setItem(`essay_timer_${taskId}`, String(nextSeconds));
            lastSavedTimeRef.current = now;
          }
          return nextSeconds;
        });
      }, 1000);
    } else if (remainingSeconds === 0 && isTimerActive) {
      // Auto-submit when time reaches 0
      setIsTimerActive(false);
      handleAutoSubmit();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, remainingSeconds, taskId]);

  // 5. Local Storage Auto-save Drafts
  useEffect(() => {
    const status = (task?.status || "").toUpperCase();
    if (status === "ASSIGNED" || status === "WRITING") {
      const timeout = setTimeout(() => {
        localStorage.setItem(`essay_draft_${taskId}`, essayText);
        // Also update backend task state using a background call if desired, or just localStorage
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      }, 1500); // Debounce saves by 1.5 seconds

      return () => clearTimeout(timeout);
    }
  }, [essayText, taskId, task?.status]);

  // Format seconds to MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // 6. Submit Handling
  const handleConfirmSubmit = () => {
    if (!isWordCountMet) {
      alert(`IELTS rules: ${task?.taskType} requires at least ${minWordsRequired} words. You currently have ${wordCount} words.`);
      return;
    }
    setConfirmOpen(true);
  };

  const executeSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setConfirmOpen(false);

    try {
      // We pass both submissionText and wordCount as parameters
      await api.patch(`/writing-tasks/${taskId}/submit`, {
        submissionText: essayText,
        wordCount: wordCount,
      });

      // Clear draft storage
      localStorage.removeItem(`essay_draft_${taskId}`);
      localStorage.removeItem(`essay_timer_${taskId}`);
      
      setSubmitSuccess(true);
      setIsTimerActive(false);

      // Redirect to student page after delay
      setTimeout(() => {
        router.push("/student");
      }, 3500);
    } catch (err: any) {
      console.error("Submission failed:", err);
      const errMsg = err.response?.data?.error?.message || err.response?.data?.message || "Internal server error occurred.";
      setSubmitError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    // If timer runs out, submit whatever is written
    setIsSubmitting(true);
    try {
      await api.patch(`/writing-tasks/${taskId}/submit`, {
        submissionText: essayText,
        wordCount: wordCount,
      });
      localStorage.removeItem(`essay_draft_${taskId}`);
      localStorage.removeItem(`essay_timer_${taskId}`);
      setSubmitSuccess(true);
      setTimeout(() => router.push("/student"), 3000);
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || err.response?.data?.message || "Auto-submit failed.";
      setSubmitError(`Time is up! We tried to auto-submit your response, but the server returned: "${errMsg}". You can download a backup of your text below.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. Backup download utility
  const handleDownloadBackup = () => {
    const blob = new Blob([essayText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IELTS_Draft_${task?.taskType || "Submission"}_Task_${taskId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 8. Render Skeletons for Loading
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader
          title="IELTS Writing Simulation"
          breadcrumbs={[{ label: "Student" }, { label: "Writing Simulation" }]}
        />
        <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1400px] mx-auto w-full">
          <Skeleton className="h-[600px] bg-white/5 rounded-3xl" />
          <Skeleton className="h-[600px] bg-white/5 rounded-3xl" />
        </main>
      </div>
    );
  }

  const status = (task?.status || "").toUpperCase();
  const isEditable = status === "ASSIGNED" || status === "WRITING";

  return (
    <div className="flex flex-col min-h-screen relative bg-[#111614] text-zinc-100">
      
      {/* Header */}
      <DashboardHeader
        title={task?.title || "Writing Simulation"}
        breadcrumbs={[
          { label: "Student", href: "/student" },
          { label: "Practice", href: "/student/practice" },
          { label: "Simulation" },
        ]}
        beforeTitle={
          <>
            <Link
              href="/student/practice"
              className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="size-3.5" /> Return
            </Link>
            <span className="text-zinc-700 select-none">/</span>
          </>
        }
      >
        {isEditable && (
          <div className="flex items-center gap-4">
            {/* Timer container */}
            <div
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold select-none transition-all ${
                remainingSeconds < 300
                  ? "bg-red-500/10 border-red-500 text-red-500 animate-pulse scale-105"
                  : "bg-black/30 border-white/10 text-zinc-300"
              }`}
            >
              <Clock className="size-3.5" />
              <span>{formatTime(remainingSeconds)}</span>
            </div>

            <Button
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
              className="bg-gold hover:bg-gold-light text-slate-900 font-bold px-5 h-9 text-xs"
            >
              Submit Response
            </Button>
          </div>
        )}
      </DashboardHeader>

      {/* Main Grid */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Status Banners */}
          {submitSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="size-5 shrink-0" />
              <div>
                <span className="font-bold">Congratulations!</span> Your essay response has been submitted successfully for review. Redirecting you back to dashboard...
              </div>
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex flex-col gap-3.5 animate-fadeIn">
              <div className="flex items-center gap-3">
                <AlertTriangle className="size-5 shrink-0" />
                <div className="font-medium">{submitError}</div>
              </div>
              <div className="flex items-center gap-3 pl-8">
                <Button
                  onClick={handleDownloadBackup}
                  variant="outline"
                  size="sm"
                  className="bg-red-950/20 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <Download className="size-3.5 mr-1.5" /> Download Essay Backup (.txt)
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* LEFT COLUMN: Prompt details */}
            <div className="space-y-6">
              <Card className="bg-[#1a211e] border-white/5 rounded-3xl shadow-none overflow-hidden select-none">
                <CardHeader className="bg-[#151b18] border-b border-white/5 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-emerald-500/10 border-none text-emerald-400 font-bold uppercase tracking-wider text-[10px] px-2 py-0.5">
                      {task?.taskType === "TASK_1" ? "IELTS Task 1" : "IELTS Task 2"}
                    </Badge>
                    <Badge variant="outline" className="border-white/10 text-zinc-500 text-[10px] uppercase font-mono px-2 py-0.5">
                      {task?.examType}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-white font-serif leading-snug">
                    {task?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Question Prompt</h4>
                    <div className="text-zinc-200 text-sm leading-relaxed whitespace-pre-line bg-black/20 p-5 rounded-2xl border border-white/5 font-serif italic">
                      {task?.questionPrompt || task?.description || "No prompt details provided."}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-gold/5 border border-gold/10">
                    <h4 className="text-xs font-bold text-gold uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="size-3.5" /> Simulation Rules & Instructions
                    </h4>
                    <ul className="text-zinc-400 text-xs leading-relaxed space-y-2 list-disc pl-4 font-mono">
                      {task?.taskType === "TASK_1" ? (
                        <>
                          <li>Recommended time: <strong className="text-zinc-200">20 minutes</strong>.</li>
                          <li>Minimum response word count: <strong className="text-zinc-200">150 words</strong>.</li>
                          <li>Write in a formal academic register summarizing charts, graphs, or maps.</li>
                        </>
                      ) : (
                        <>
                          <li>Recommended time: <strong className="text-zinc-200">40 minutes</strong>.</li>
                          <li>Minimum response word count: <strong className="text-zinc-200">250 words</strong>.</li>
                          <li>Write a structured opinion, solution, or argumentative essay.</li>
                        </>
                      )}
                      <li>Drafts are saved locally automatically every 1.5 seconds.</li>
                      <li>When the countdown timer expires, the page will auto-submit.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Score / Feedback Block (Only visible in SCORED mode) */}
              {!isEditable && task && (task.bandScore != null || task.feedback) && (
                <Card className="bg-[#1a211e] border-white/5 rounded-3xl shadow-none overflow-hidden border-gold/20">
                  <CardHeader className="bg-gold/10 border-b border-gold/20 p-6 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                      <Award className="size-4 text-gold animate-bounce" /> Evaluation Result
                    </CardTitle>
                    {task.bandScore != null && (
                      <Badge className="bg-gold text-slate-900 font-bold px-3 py-1 text-sm border-none shadow-lg">
                        Band {task.bandScore}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {task.feedback && (
                      <div>
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2.5">Teacher Feedback</h4>
                        <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line p-4 rounded-xl bg-black/20 border border-white/5">
                          {task.feedback}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* RIGHT COLUMN: Writing Area */}
            <div className="space-y-4">
              <Card className="bg-[#1a211e] border-white/5 rounded-3xl shadow-none overflow-hidden flex flex-col min-h-[500px]">
                <CardHeader className="bg-[#151b18] border-b border-white/5 px-6 py-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <PenTool className="size-4 text-emerald-400" /> Response Essay
                  </CardTitle>
                  <div className="text-right">
                    {draftSaved && isEditable && (
                      <span className="text-[10px] text-zinc-500 font-mono italic animate-pulse">
                        Draft saved
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col gap-4">
                  <Textarea
                    value={essayText}
                    onChange={(e) => isEditable && setEssayText(e.target.value)}
                    disabled={!isEditable || isSubmitting}
                    placeholder={
                      isEditable
                        ? `Type your essay response here... (Minimum ${minWordsRequired} words)`
                        : "No response text was submitted."
                    }
                    className={`flex-1 min-h-[350px] bg-black/10 border-white/5 text-zinc-200 text-sm leading-relaxed p-4 font-sans focus-visible:ring-1 focus-visible:ring-gold focus-visible:border-gold/30 placeholder:text-zinc-700 resize-none ${
                      !isEditable ? "cursor-default opacity-85 select-text focus-visible:ring-0" : ""
                    }`}
                  />

                  {/* Word count summary line */}
                  <div className="flex justify-between items-center px-2 select-none">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 font-mono">Word Count:</span>
                      <span
                        className={`text-sm font-bold font-mono ${
                          isWordCountMet ? "text-emerald-400" : "text-zinc-500"
                        }`}
                      >
                        {wordCount}
                      </span>
                      <span className="text-zinc-600 text-xs font-mono">/ {minWordsRequired}</span>
                      {isWordCountMet && isEditable && (
                        <span className="text-emerald-400 text-xs shrink-0 select-none animate-bounce">
                          ✓
                        </span>
                      )}
                    </div>
                    {isEditable && (
                      <div className="text-right">
                        {!isWordCountMet ? (
                          <span className="text-[10px] text-zinc-500 font-mono">
                            Need {minWordsRequired - wordCount} more words
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-500 font-mono">
                            Word count met!
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>

      {/* CONFIRMATION OVERLAY MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className="bg-[#1a211e] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-full bg-gold/15 flex items-center justify-center text-gold shrink-0">
                <AlertTriangle className="size-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white font-serif">Submit Writing Response</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  You have written <strong className="text-zinc-200 font-mono">{wordCount} words</strong>. 
                  Once submitted, your response will be locked and sent directly to your teacher for review. 
                  You will not be able to edit this draft anymore.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setConfirmOpen(false)}
                disabled={isSubmitting}
                className="border-white/10 hover:bg-white/5 text-zinc-400 font-medium h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={executeSubmit}
                disabled={isSubmitting}
                className="bg-gold hover:bg-gold-light text-slate-900 font-bold h-9 text-xs px-5"
              >
                {isSubmitting ? "Submitting..." : "Yes, Submit Response"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
