"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function NotificationsPage() {
  const [audience, setAudience] = useState("all");
  const [type, setType] = useState("account_alert");
  const [targetUserId, setTargetUserId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    if (audience === "individual" && !targetUserId.trim()) {
      alert("Target User ID is required for individual audience.");
      return;
    }

    try {
      setSending(true);
      const payload: any = {
        audience,
        type,
        title: title.trim(),
        message: message.trim(),
      };

      if (audience === "individual") {
        payload.targetUserId = targetUserId.trim();
      }
      if (ctaText.trim()) {
        payload.ctaText = ctaText.trim();
      }
      if (ctaUrl.trim()) {
        payload.ctaUrl = ctaUrl.trim();
      }

      await api.post("/admin/notifications", payload);
      alert("Notification sent successfully!");
      setTitle("");
      setMessage("");
      setTargetUserId("");
      setCtaText("");
      setCtaUrl("");
    } catch (error) {
      console.error("Failed to send notification:", error);
      alert("Failed to send notification.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Topbar/Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614] select-none">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Notifications</h1>
          <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
            <span>Admin</span>
            <span>›</span>
            <span className="text-zinc-400">Comms</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Sub-header context */}
          <div className="flex items-center justify-between">
            <div className="text-[12px] text-zinc-500 font-mono tracking-wide">
              Broadcast messages to all users, teachers, students, or individuals
            </div>
            <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400 font-bold tracking-wider px-3 py-1">
              ADMIN
            </Badge>
          </div>

          {/* Compose Notification Card */}
          <div className="bg-[#1a211e] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 bg-[#151b18]">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Compose notification</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSend} className="space-y-5">
                
                {/* Audience and Type Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* AUDIENCE Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Audience</label>
                    <select
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="all">All users</option>
                      <option value="teachers">Teachers only</option>
                      <option value="students">Students only (role: user)</option>
                      <option value="individual">Individual user</option>
                    </select>
                  </div>

                  {/* TYPE Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="account_alert">Account alert</option>
                      <option value="exam_reminder">Exam reminder</option>
                      <option value="score_available">Score available</option>
                      <option value="practice_ready">Practice ready</option>
                      <option value="role_changed">Role changed</option>
                      <option value="teacher_linked">Teacher linked</option>
                      <option value="task_assigned">Task assigned</option>
                      <option value="task_reviewed">Task reviewed</option>
                      <option value="task_scored">Task scored</option>
                    </select>
                  </div>

                </div>

                {/* Target User ID (only shown when audience is individual) */}
                {audience === "individual" && (
                  <div className="flex flex-col gap-2 animate-fadeIn">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Target user ID</label>
                    <input
                      type="text"
                      required
                      value={targetUserId}
                      onChange={(e) => setTargetUserId(e.target.value)}
                      placeholder="MongoDB ObjectId of the user..."
                      className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-full md:w-[350px] focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-700"
                    />
                  </div>
                )}

                {/* TITLE Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Notification title..."
                    className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-700"
                  />
                </div>

                {/* MESSAGE Textarea */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Full message body..."
                    className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-700 w-full min-h-[90px] resize-y"
                  />
                </div>

                {/* CTA Label & URL Optional Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* CTA Label Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">
                      CTA Label <span className="text-zinc-600 text-[9px] lowercase font-normal italic">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      placeholder="e.g. View task"
                      className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-700"
                    />
                  </div>

                  {/* CTA URL Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">
                      CTA URL <span className="text-zinc-600 text-[9px] lowercase font-normal italic">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={ctaUrl}
                      onChange={(e) => setCtaUrl(e.target.value)}
                      placeholder="/pages/tasks/list.html"
                      className="bg-[#111614] border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm h-10 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-700"
                    />
                  </div>

                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button 
                    type="submit"
                    disabled={sending}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 px-6 rounded-lg text-sm transition-all cursor-pointer"
                  >
                    {sending ? "Sending..." : "Send notification"}
                  </Button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
