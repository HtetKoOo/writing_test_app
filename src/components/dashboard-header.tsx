"use client";

import React from "react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardHeaderProps {
  title: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  description?: string;
  titleClassName?: string;
  hideNotification?: boolean;
  beforeTitle?: React.ReactNode;
  leftContent?: React.ReactNode;
  children?: React.ReactNode;
}

export function DashboardHeader({
  title,
  breadcrumbs,
  description,
  titleClassName,
  hideNotification = false,
  beforeTitle,
  leftContent,
  children,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#111614] select-none">
      <div className="flex items-center gap-4 md:gap-12">
        <div className="flex items-center gap-4">
          {/* Mobile menu trigger */}
          <SidebarTrigger className="md:hidden text-zinc-400 hover:text-white" />
          {beforeTitle}
          <div>
            <h1 className={cn("text-xl font-bold text-white tracking-tight flex items-center gap-3", titleClassName)}>
              {title}
            </h1>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="text-[11px] text-zinc-500 font-medium tracking-wide flex items-center gap-1.5 mt-0.5">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="mx-0.5">›</span>}
                    {crumb.href ? (
                      <Link href={crumb.href} className="hover:text-zinc-300 transition-colors">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-zinc-400">{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
            {description && (
              <p className="text-zinc-500 text-sm mt-1">{description}</p>
            )}
          </div>
        </div>
        {leftContent}
      </div>

      <div className="flex items-center gap-4">
        {children}
        {!hideNotification && <NotificationDropdown />}
      </div>
    </header>
  );
}
