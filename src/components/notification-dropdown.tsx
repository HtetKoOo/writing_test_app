"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  _id?: string;
  title: string;
  content?: string;
  message?: string;
  notiType?: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch initial notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications?page=1&limit=15");
      const data = res.data?.data ?? res.data ?? {};
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    // Optimistic Update
    const prevNotis = [...notifications];
    const prevCount = unreadCount;

    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await api.patch("/notifications/read", { ids: "all" });
    } catch (err) {
      console.error("Failed to mark all read:", err);
      setNotifications(prevNotis);
      setUnreadCount(prevCount);
    }
  };

  const handleMarkOneRead = async (notiId: string) => {
    // Optimistic Update
    const target = notifications.find(n => (n.id || n._id) === notiId);
    if (!target || target.isRead) return;

    setNotifications(notifications.map(n => 
      (n.id || n._id) === notiId ? { ...n, isRead: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await api.patch(`/notifications/${notiId}/read`);
    } catch (err) {
      console.error("Failed to mark notification read:", err);
      // Revert if failed
      fetchNotifications();
    }
  };

  const getNotificationIcon = (title: string, content: string, type?: string) => {
    const t = (type || "").toUpperCase();
    const text = `${title} ${content}`.toLowerCase();
    
    if (t === "TASK_DECLINED" || text.includes("decline") || text.includes("declined")) {
      return (
        <span className="text-red-500 text-[14px] flex-shrink-0 pt-0.5 select-none font-bold">
          ❌
        </span>
      );
    }
    if (t === "TASK_ACCEPTED" || text.includes("accept") || text.includes("accepted")) {
      return (
        <span className="text-emerald-500 text-[14px] flex-shrink-0 pt-0.5 select-none font-bold">
          ✅
        </span>
      );
    }
    // Default Bell update
    return (
      <span className="text-amber-500 text-[14px] flex-shrink-0 pt-0.5 select-none">
        🔔
      </span>
    );
  };

  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return "";
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={`size-9 rounded-full relative transition-all border border-white/10 ${
          isOpen 
            ? "bg-white text-black hover:bg-zinc-200" 
            : "bg-[#1a211e] text-zinc-400 hover:text-white hover:bg-white/10"
        }`}
      >
        <span className="sr-only">Notifications</span>
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white font-mono animate-fadeIn shadow-lg">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-[360px] bg-[#1a211e] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fadeIn text-left">
          
          {/* Header block */}
          <div className="flex justify-between items-center px-4 py-3 bg-[#151b18] border-b border-white/5 select-none">
            <h3 className="text-xs font-bold text-white tracking-wide">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors font-semibold bg-transparent border-0 cursor-pointer p-0"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List items block */}
          <div className="max-h-[350px] overflow-y-auto divide-y divide-white/5">
            {loading && notifications.length === 0 ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 flex gap-3 animate-pulse">
                  <div className="size-4 rounded-full bg-white/5 mt-1 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 bg-white/5 rounded" />
                    <div className="h-2.5 w-full bg-white/5 rounded" />
                    <div className="h-2.5 w-16 bg-white/5 rounded" />
                  </div>
                </div>
              ))
            ) : notifications.length === 0 ? (
              <div className="py-10 px-4 text-center text-zinc-500 text-xs font-mono select-none">
                No notifications yet.
              </div>
            ) : (
              notifications.map((noti) => {
                const notiId = noti.id || noti._id || "";
                const title = noti.title || "Notification";
                const desc = noti.content || noti.message || "";
                const icon = getNotificationIcon(title, desc, noti.type || noti.notiType);
                const time = formatTimeAgo(noti.createdAt);

                return (
                  <div
                    key={notiId}
                    onClick={() => handleMarkOneRead(notiId)}
                    className={`p-4 flex gap-3.5 items-start hover:bg-white/[0.02] transition-colors relative cursor-pointer ${
                      !noti.isRead ? "bg-white/[0.01]" : ""
                    }`}
                  >
                    {/* Icon container */}
                    <div className="flex-shrink-0 mt-0.5">{icon}</div>

                    {/* Content block */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-zinc-300 block mb-0.5 leading-snug">
                        {title}
                      </span>
                      <p className="text-[10px] text-zinc-500 font-mono tracking-wide leading-normal break-words">
                        {desc}
                      </p>
                      <span className="text-[9px] text-zinc-600 block mt-1.5 font-mono select-none">
                        {time}
                      </span>
                    </div>

                    {/* Unread dot indicator */}
                    {!noti.isRead && (
                      <span className="size-1.5 rounded-full bg-emerald-500 absolute right-4 top-4 select-none" />
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}
    </div>
  );
}
