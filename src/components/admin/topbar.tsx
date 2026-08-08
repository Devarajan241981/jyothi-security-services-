"use client";

import { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/admin/sidebar";
import { NotificationBell } from "@/components/admin/notification-bell";
import { LanguageToggle } from "@/components/admin/language-toggle";
import { signOut } from "@/lib/actions/admin/auth";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { Database } from "@/types/database";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export function AdminTopbar({
  email,
  notifications,
  unreadCount,
  attendanceReminderCount,
  salaryReminderCount,
}: {
  email: string | undefined;
  notifications: Notification[];
  unreadCount: number;
  attendanceReminderCount: number;
  salaryReminderCount: number;
}) {
  const [open, setOpen] = useState(false);
  const { dict } = useAdminDict();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-border bg-card px-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label={dict.topbar.openMenu} className="shrink-0">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Admin navigation</SheetTitle>
            <AdminSidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:block" />

      <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
        <LanguageToggle />
        <NotificationBell
          notifications={notifications}
          unreadCount={unreadCount}
          attendanceReminderCount={attendanceReminderCount}
          salaryReminderCount={salaryReminderCount}
        />
        <span className="hidden max-w-[10rem] truncate text-sm text-muted-foreground md:inline">
          {email}
        </span>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm" className="gap-2 px-2 sm:px-3">
            <LogOut className="size-4" />
            <span className="hidden sm:inline">{dict.topbar.logout}</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
