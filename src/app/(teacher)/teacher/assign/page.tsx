"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";

function AssignForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preStudentId = searchParams.get("studentId") || "";

  // State
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentId, setStudentId] = useState(preStudentId);
  const [assignAll, setAssignAll] = useState(false);
  const [mode, setMode] = useState("teacher_new");

  // New task fields
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [taskType, setTaskType] = useState("");
  const [examType, setExamType] = useState("");

  // Existing task fields
  const [existingTaskId, setExistingTaskId] = useState("");
  const [existingPreview, setExistingPreview] = useState<any>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState("");

  // Topic field
  const [topic, setTopic] = useState("");

  // Schedule fields
  const [dueDate, setDueDate] = useState("");
  const [reminderHours, setReminderHours] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // Load students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/teacher/students?stats=true");
        const raw = response.data?.data ?? [];
        const items = Array.isArray(raw) ? raw : (raw.students || raw.users || []);
        setStudents(items);
        
        // Pre-select if we have query param
        if (preStudentId) {
          setStudentId(preStudentId);
        }
      } catch (error) {
        console.error("Failed to load students:", error);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [preStudentId]);

  // Debounce existing task preview
  useEffect(() => {
    if (mode !== "teacher_existing" || !existingTaskId.trim()) {
      setExistingPreview(null);
      setPreviewError("");
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingPreview(true);
      setPreviewError("");
      setExistingPreview(null);
      try {
        const response = await api.get(`/writing-tasks/${existingTaskId.trim()}`);
        const task = response.data?.data ?? response.data;
        if (!task) {
          setPreviewError("Task not found.");
        } else {
          setExistingPreview(task);
        }
      } catch (error) {
        setPreviewError("Task not found.");
      } finally {
        setLoadingPreview(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [existingTaskId, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignAll && !studentId) {
      alert("Please select a student or enable 'Assign to all students'.");
      return;
    }

    const payload: any = { taskSource: mode };
    if (!assignAll) {
      payload.studentId = studentId;
    }

    if (dueDate) {
      payload.dueDate = new Date(dueDate).toISOString();
    }
    if (reminderHours) {
      payload.reminderHours = Number(reminderHours);
    }

    if (mode === "teacher_new") {
      if (!title.trim()) {
        alert("Title is required.");
        return;
      }
      if (!taskType) {
        alert("Task type is required.");
        return;
      }
      payload.title = title.trim();
      payload.taskType = taskType;
      if (prompt.trim()) payload.questionPrompt = prompt.trim();
      if (examType) payload.examType = examType;
    } else if (mode === "teacher_existing") {
      if (!existingTaskId.trim()) {
        alert("Please enter a valid Task ID.");
        return;
      }
      payload.taskId = existingTaskId.trim();
    } else if (mode === "teacher_topic") {
      if (!topic.trim()) {
        alert("Please enter a topic keyword.");
        return;
      }
      payload.topic = topic.trim();
    }

    try {
      setSubmitting(true);
      await api.post("/teacher/assign", payload);
      alert("Task successfully assigned!");
      router.push("/teacher");
    } catch (error: any) {
      console.error("Assignment failed:", error);
      alert(error.response?.data?.message || "Failed to assign task.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Topbar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614]">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden text-zinc-400 hover:text-white" />
          <Link href="/teacher" className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
            <ArrowLeft className="size-3.5" /> Dashboard
          </Link>
          <span className="text-zinc-700 select-none">/</span>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Assign Task</h1>
            <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
              <span>Teacher</span>
              <span>›</span>
              <span className="text-zinc-400">Students</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationDropdown />
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Sub-header context */}
          <div className="flex items-center justify-between">
            <div className="text-[12px] text-zinc-500 font-mono tracking-wide">
              Create a new task, assign an existing one, or assign by topic keyword
            </div>
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold tracking-wider px-3 py-1">
              TEACHER
            </Badge>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student selection card */}
            <Card className="bg-[#1a211e] border-white/5 rounded-xl overflow-hidden shadow-2xl">
              <CardHeader className="bg-[#151b18] border-b border-white/5 py-4">
                <CardTitle className="text-sm font-semibold text-white">Select Student</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Student</label>
                  <select
                    disabled={assignAll || loadingStudents}
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-full md:w-[350px] focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
                  >
                    {loadingStudents ? (
                      <option value="">Loading students...</option>
                    ) : students.length === 0 ? (
                      <option value="">No students linked yet</option>
                    ) : (
                      <>
                        <option value="">— Select a student —</option>
                        {students.map((s) => (
                          <option key={s.id || s._id} value={s.id || s._id}>
                            {s.name || s.email}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="assign-all"
                    checked={assignAll}
                    onChange={(e) => setAssignAll(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-[#111614] text-emerald-600 focus:ring-emerald-500 focus:ring-offset-[#1a211e] cursor-pointer"
                  />
                  <label htmlFor="assign-all" className="text-xs text-zinc-300 cursor-pointer font-medium select-none">
                    Assign to all my students
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Task mode card */}
            <Card className="bg-[#1a211e] border-white/5 rounded-xl overflow-hidden shadow-2xl">
              <CardHeader className="bg-[#151b18] border-b border-white/5 py-4">
                <CardTitle className="text-sm font-semibold text-white">Task Mode</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-full md:w-[350px] focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="teacher_new">Create a new task</option>
                    <option value="teacher_existing">Use an existing task</option>
                    <option value="teacher_topic">Assign by topic</option>
                  </select>
                </div>

                {/* MODE 1: Create a new task */}
                {mode === "teacher_new" && (
                  <div className="pt-4 border-t border-white/5 space-y-5 animate-fadeIn">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">
                        Task Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. IELTS Task 2 — Environment"
                        className="bg-[#111614] border-white/10 text-zinc-200 h-10 focus-visible:ring-emerald-500"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Question Prompt</label>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Paste the full question text here..."
                        rows={4}
                        className="bg-[#111614] border-white/10 text-zinc-200 resize-y focus-visible:ring-emerald-500 min-h-[90px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">
                          Task Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={taskType}
                          onChange={(e) => setTaskType(e.target.value)}
                          className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        >
                          <option value="">Select type...</option>
                          <option value="TASK_1">Task 1</option>
                          <option value="TASK_2">Task 2</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Exam Type</label>
                        <select
                          value={examType}
                          onChange={(e) => setExamType(e.target.value)}
                          className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        >
                          <option value="">Select exam...</option>
                          <option value="ACADEMIC">Academic</option>
                          <option value="GENERAL">General Training</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 2: Use an existing task */}
                {mode === "teacher_existing" && (
                  <div className="pt-4 border-t border-white/5 space-y-4 animate-fadeIn">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Task ID</label>
                      <Input
                        required
                        value={existingTaskId}
                        onChange={(e) => setExistingTaskId(e.target.value)}
                        placeholder="Paste the task ObjectId..."
                        className="bg-[#111614] border-white/10 text-zinc-200 h-10 md:w-[350px] focus-visible:ring-emerald-500"
                      />
                    </div>

                    {/* Debounced loading/preview state */}
                    {loadingPreview && (
                      <p className="text-xs text-zinc-500 font-mono animate-pulse">Loading task preview...</p>
                    )}
                    {previewError && (
                      <p className="text-xs text-red-400 font-mono">{previewError}</p>
                    )}
                    {existingPreview && (
                      <div className="p-4 bg-[#111614] border border-white/10 rounded-lg space-y-2 animate-fadeIn text-sm">
                        <div className="flex items-center justify-between">
                          <strong className="text-zinc-200">{existingPreview.title}</strong>
                          <span className="text-xs text-zinc-500 font-mono">
                            {existingPreview.taskType} • {existingPreview.examType || "GENERAL"}
                          </span>
                        </div>
                        {existingPreview.questionPrompt && (
                          <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed mt-1">
                            {existingPreview.questionPrompt}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* MODE 3: Assign by topic keyword */}
                {mode === "teacher_topic" && (
                  <div className="pt-4 border-t border-white/5 space-y-4 animate-fadeIn">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Topic Keyword</label>
                      <Input
                        required
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. environment, technology, health..."
                        className="bg-[#111614] border-white/10 text-zinc-200 h-10 md:w-[350px] focus-visible:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Schedule card */}
            <Card className="bg-[#1a211e] border-white/5 rounded-xl overflow-hidden shadow-2xl">
              <CardHeader className="bg-[#151b18] border-b border-white/5 py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold text-white">Schedule</CardTitle>
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Optional deadline</span>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Due Date</label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Reminder before deadline</label>
                  <select
                    value={reminderHours}
                    onChange={(e) => setReminderHours(e.target.value)}
                    className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="">No reminder</option>
                    <option value="24">24 hours before</option>
                    <option value="48">48 hours before</option>
                    <option value="72">72 hours before</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Submit block */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-lg text-sm shadow-xl transition-all cursor-pointer"
              >
                {submitting ? "Assigning..." : mode === "teacher_new" ? "Create & assign task" : mode === "teacher_existing" ? "Assign existing task" : "Assign by topic"}
              </Button>
              <Link href="/teacher" className="bg-[#1a211e] hover:bg-white/5 border border-white/10 text-zinc-300 font-bold h-12 px-6 rounded-lg text-sm transition-all flex items-center justify-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function AssignPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-zinc-500">Loading form...</div>}>
      <AssignForm />
    </Suspense>
  );
}
