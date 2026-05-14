"use client";

import {
  Bell,
  Edit,
  Flag,
  LayoutGrid,
  ListTodo,
  LogOut,
  ScrollText,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "./auth-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu items
const navGroups = [
  {
    title: "OVERVIEW",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutGrid },
    ],
  },
  {
    title: "PEOPLE",
    items: [
      { title: "Users", url: "/admin/users", icon: Users },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { title: "Tasks", url: "/admin/tasks", icon: Edit },
      { title: "Moderation", url: "/admin/moderation", icon: Flag },
      { title: "Review Queue", url: "/admin/review", icon: ListTodo },
      { title: "Audit Logs", url: "/admin/audit-logs", icon: ScrollText },
    ],
  },
  {
    title: "COMMS",
    items: [
      { title: "Notifications", url: "/admin/notifications", icon: Bell },
    ],
  },
];

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" className="border-r-0 dark:bg-[#1a211e]">
      <SidebarHeader className="pt-6 pb-4 px-6">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-primary-foreground">
            <span className="font-bold text-lg">W</span>
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold text-white">WriteSystem</span>
            <span className="text-xs text-[var(--gold)]">ADMIN PANEL</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        {navGroups.map((group) => (
          <SidebarGroup key={group.title} className="pt-4">
            <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={`mt-1 hover:bg-white/5 transition-colors ${isActive ? 'bg-[#2a3430] text-white' : 'text-zinc-400'}`}
                      >
                        <Link href={item.url} className="flex items-center gap-3 px-2 py-5">
                          <item.icon className={`size-4 ${item.title === 'Notifications' && !isActive ? 'text-[var(--gold)]' : ''}`} />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4 mt-auto">
        <div className="flex items-center gap-3 px-2 py-3 mb-2 rounded-lg bg-black/20">
          <Avatar className="h-9 w-9 border-2 border-blue-600/30">
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-600 text-white font-semibold">
              {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-semibold truncate text-zinc-200">{user?.name || 'Admin User'}</span>
            <span className="text-xs text-zinc-500 truncate">{user?.email || 'admin@writesystem.com'}</span>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-400/90 border border-red-900/50 hover:bg-red-950/30 rounded-md transition-colors"
        >
          <span>Sign out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
