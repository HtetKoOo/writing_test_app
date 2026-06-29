"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutGrid,
  LogOut,
  PenTool,
  TrendingUp,
  BookOpen,
  Newspaper,
  Users,
  ShieldAlert,
  Activity,
  Bell,
  FileText,
} from "lucide-react";

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : user.email.substring(0, 2).toUpperCase();

  const getRoleConfig = (role: string) => {
    switch (role) {
      case "admin":
        return {
          label: "Administrator",
          colorClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          borderClass: "border-blue-500/30 hover:border-blue-500/70",
          fallbackClass: "bg-blue-600 text-white",
          dashboardUrl: "/admin",
        };
      case "teacher":
        return {
          label: "Teacher",
          colorClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          borderClass: "border-emerald-500/30 hover:border-emerald-500/70",
          fallbackClass: "bg-emerald-600 text-white",
          dashboardUrl: "/teacher",
        };
      case "student":
      default:
        return {
          label: "Student",
          colorClass: "bg-gold/10 text-gold border-gold/20",
          borderClass: "border-gold/30 hover:border-gold/70",
          fallbackClass: "bg-gold text-slate-900",
          dashboardUrl: "/student",
        };
    }
  };

  const config = getRoleConfig(user.role);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      window.dispatchEvent(
        new CustomEvent("close-dropdowns", { detail: { sender: "profile" } })
      );
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className="outline-none cursor-pointer">
        <Avatar className={`size-9 border-2 rounded-full transition-colors ${config.borderClass}`}>
          <AvatarImage src="" />
          <AvatarFallback className={`font-bold text-xs ${config.fallbackClass}`}>
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 bg-[#1a211e] border-white/10 text-white rounded-xl shadow-2xl p-1.5 select-none"
      >
        <DropdownMenuLabel className="px-3 py-2.5 flex flex-col gap-1 text-left">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-sm truncate text-zinc-100">
              {user.name || "Scholar"}
            </span>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${config.colorClass}`}
            >
              {config.label}
            </span>
          </div>
          <span className="text-xs text-zinc-500 truncate font-mono">
            {user.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/5" />

        <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg">
          <Link href={config.dashboardUrl} className="flex items-center gap-2.5 w-full">
            <LayoutGrid className="size-4 text-zinc-400" />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>
        </DropdownMenuItem>

        {/* Role Specific Shortcuts */}
        {user.role === "student" && (
          <>
            <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg">
              <Link href="/student/practice" className="flex items-center gap-2.5 w-full">
                <PenTool className="size-4 text-zinc-400" />
                <span className="text-xs font-medium">Writing Practice</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg">
              <Link href="/student/progress" className="flex items-center gap-2.5 w-full">
                <TrendingUp className="size-4 text-zinc-400" />
                <span className="text-xs font-medium">My Progress</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg">
              <Link href="/student/vocabulary" className="flex items-center gap-2.5 w-full">
                <BookOpen className="size-4 text-zinc-400" />
                <span className="text-xs font-medium">Vocabulary</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg">
              <Link href="/student/news" className="flex items-center gap-2.5 w-full">
                <Newspaper className="size-4 text-zinc-400" />
                <span className="text-xs font-medium">News Feed</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {user.role === "teacher" && (
          <>
            <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg">
              <Link href="/teacher/students" className="flex items-center gap-2.5 w-full">
                <Users className="size-4 text-zinc-400" />
                <span className="text-xs font-medium">My Students</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg">
              <Link href="/teacher/review" className="flex items-center gap-2.5 w-full">
                <FileText className="size-4 text-zinc-400" />
                <span className="text-xs font-medium">Review Queue</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {user.role === "admin" && (
          <>
            <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg">
              <Link href="/admin/users" className="flex items-center gap-2.5 w-full">
                <Users className="size-4 text-zinc-400" />
                <span className="text-xs font-medium">Manage Users</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg">
              <Link href="/admin/tasks" className="flex items-center gap-2.5 w-full">
                <FileText className="size-4 text-zinc-400" />
                <span className="text-xs font-medium">Manage Tasks</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg">
              <Link href="/admin/moderation" className="flex items-center gap-2.5 w-full">
                <ShieldAlert className="size-4 text-zinc-400" />
                <span className="text-xs font-medium">Content Moderation</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg">
              <Link href="/admin/notifications" className="flex items-center gap-2.5 w-full">
                <Bell className="size-4 text-zinc-400" />
                <span className="text-xs font-medium">Broadcasts</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white cursor-pointer px-3 py-2 rounded-lg">
              <Link href="/admin/audit-logs" className="flex items-center gap-2.5 w-full">
                <Activity className="size-4 text-zinc-400" />
                <span className="text-xs font-medium">Audit Logs</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="bg-white/5" />

        <DropdownMenuItem
          onClick={logout}
          className="focus:bg-red-500/10 focus:text-red-400 text-red-400/90 cursor-pointer px-3 py-2 rounded-lg"
        >
          <div className="flex items-center gap-2.5 w-full">
            <LogOut className="size-4" />
            <span className="text-xs font-medium">Sign out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
