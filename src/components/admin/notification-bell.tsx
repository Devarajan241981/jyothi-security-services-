"use client";

import { useRouter } from "next/navigation";
import { Bell, CalendarCheck2, Inbox, UserPlus, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  clearAllNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/actions/admin/notifications";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { Database } from "@/types/database";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

const typeIcon = {
  new_enquiry: Inbox,
  new_application: UserPlus,
} as const;

export function NotificationBell({
  notifications,
  unreadCount,
  attendanceReminderCount,
  salaryReminderCount,
}: {
  notifications: Notification[];
  unreadCount: number;
  attendanceReminderCount: number;
  salaryReminderCount: number;
}) {
  const router = useRouter();
  const { dict, locale } = useAdminDict();

  async function handleNotificationClick(n: Notification) {
    if (!n.is_read) {
      const result = await markNotificationRead(n.id);
      if (!result.success) toast.error(result.error);
    }
    if (n.link) router.push(n.link);
  }

  async function handleMarkAllRead() {
    const result = await markAllNotificationsRead();
    if (!result.success) toast.error(result.error);
  }

  async function handleClearAll() {
    const result = await clearAllNotifications();
    if (!result.success) toast.error(result.error);
    else toast.success(dict.notifications.allCleared);
  }

  const hasAny = notifications.length > 0 || attendanceReminderCount > 0 || salaryReminderCount > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative" aria-label={dict.notifications.title}>
          <Bell className="size-4" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex size-4.5 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-1.5rem)] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">{dict.notifications.title}</p>
          <div className="flex items-center gap-3">
            {notifications.some((n) => !n.is_read) ? (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-primary hover:underline"
              >
                {dict.notifications.markAllRead}
              </button>
            ) : null}
            {notifications.length > 0 ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="text-xs font-medium text-muted-foreground hover:text-destructive hover:underline"
                  >
                    {dict.notifications.clearAll}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{dict.notifications.clearAllConfirmTitle}</AlertDialogTitle>
                    <AlertDialogDescription>{dict.notifications.clearAllConfirmDesc}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{dict.common.cancel}</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-white hover:bg-destructive/90"
                      onClick={handleClearAll}
                    >
                      {dict.notifications.clearAll}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {attendanceReminderCount > 0 ? (
            <button
              type="button"
              onClick={() => router.push("/admin/attendance")}
              className="flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left hover:bg-secondary/60"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent-foreground">
                <CalendarCheck2 className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{dict.notifications.attendanceTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {attendanceReminderCount} {attendanceReminderCount === 1 ? dict.notifications.activeGuard : dict.notifications.activeGuards} {dict.notifications.attendanceReminderSuffix}
                </p>
              </div>
            </button>
          ) : null}

          {salaryReminderCount > 0 ? (
            <button
              type="button"
              onClick={() => router.push("/admin/salary")}
              className="flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left hover:bg-secondary/60"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent-foreground">
                <Wallet className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{dict.notifications.salaryTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {salaryReminderCount} {salaryReminderCount === 1 ? dict.notifications.activeGuard : dict.notifications.activeGuards} {dict.notifications.salaryReminderSuffix}
                </p>
              </div>
            </button>
          ) : null}

          {notifications.map((n) => {
            const Icon = typeIcon[n.type];
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => handleNotificationClick(n)}
                className="flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-secondary/60"
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${n.is_read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-medium text-foreground">{n.title}</p>
                    {!n.is_read ? <span className="size-1.5 shrink-0 rounded-full bg-primary" /> : null}
                  </div>
                  {n.message ? (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.message}</p>
                  ) : null}
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {new Date(n.created_at).toLocaleString(locale === "kn" ? "kn-IN" : "en-IN")}
                  </p>
                </div>
              </button>
            );
          })}

          {!hasAny ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              {dict.notifications.empty}
            </p>
          ) : null}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
