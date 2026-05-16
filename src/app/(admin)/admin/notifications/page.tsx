"use client";

import React, { useState } from "react";
import { 
  Bell, 
  Send, 
  Users, 
  User, 
  MessageSquare,
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import api from "@/lib/api";

export default function NotificationsPage() {
  const [audience, setAudience] = useState("all");
  const [type, setType] = useState("INFO");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!title || !message) return;
    
    try {
      setSending(true);
      await api.post('/admin/notifications', {
        audience,
        type,
        title,
        message,
      });
      alert("Notification sent successfully!");
      setTitle("");
      setMessage("");
    } catch (error) {
      console.error("Failed to send notification:", error);
      alert("Failed to send notification.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">System Notifications</h1>
          <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-0.5">
            <span>Admin</span>
            <span>›</span>
            <span className="text-zinc-400">Communications</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left: Compose */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-2xl overflow-hidden">
              <CardHeader className="bg-[#151b18] border-b border-white/5">
                <CardTitle className="text-lg text-white">Broadcast Message</CardTitle>
                <CardDescription className="text-zinc-500">Send a system-wide notification to students or teachers.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Audience</label>
                    <Select value={audience} onValueChange={setAudience}>
                      <SelectTrigger className="bg-[#111614] border-white/10 text-zinc-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a211e] border-white/10 text-zinc-300">
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                        <SelectItem value="teachers">Teachers Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Alert Type</label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="bg-[#111614] border-white/10 text-zinc-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a211e] border-white/10 text-zinc-300">
                        <SelectItem value="INFO">Information</SelectItem>
                        <SelectItem value="SUCCESS">Success</SelectItem>
                        <SelectItem value="WARNING">Warning</SelectItem>
                        <SelectItem value="URGENT">Urgent Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Notification Title</label>
                  <Input 
                    placeholder="e.g. System Maintenance Tomorrow" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-[#111614] border-white/10 text-zinc-200 h-11 focus-visible:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Message Body</label>
                  <Textarea 
                    placeholder="Write your message here..." 
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-[#111614] border-white/10 text-zinc-200 resize-none focus-visible:ring-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <Button 
                    onClick={handleSend} 
                    disabled={sending || !title || !message}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 gap-3 transition-all shadow-lg shadow-blue-900/20"
                  >
                    <Send className="size-4" />
                    {sending ? "Sending..." : "Blast Notification"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Tips/Stats */}
          <div className="space-y-6">
            <Card className="bg-[#1a211e] border-white/5 rounded-xl shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="size-4 text-[var(--gold)]" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="size-8 rounded-lg bg-blue-500/10 flex-shrink-0 flex items-center justify-center">
                    <MessageSquare className="size-4 text-blue-400" />
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Use clear, action-oriented titles to increase user engagement.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="size-8 rounded-lg bg-emerald-500/10 flex-shrink-0 flex items-center justify-center">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Success notifications are great for rewarding milestone achievements.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="size-8 rounded-lg bg-amber-500/10 flex-shrink-0 flex items-center justify-center">
                    <AlertCircle className="size-4 text-amber-400" />
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Reserve urgent alerts for critical system updates only.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-600/10">
              <h3 className="text-sm font-semibold text-white mb-2">History</h3>
              <p className="text-[11px] text-zinc-500 italic flex items-center gap-2">
                <Clock className="size-3" />
                Notification history is automatically logged in Audit Logs.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Helper icons missing in imports
function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
