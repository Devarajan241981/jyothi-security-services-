"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { InlineStatusSelect } from "@/components/admin/inline-status-select";
import {
  deleteEnquiry,
  permanentlyDeleteEnquiry,
  restoreEnquiry,
  updateEnquiryStatus,
} from "@/lib/actions/admin/enquiries";
import { ENQUIRY_STATUS_LABELS } from "@/lib/constants/admin";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Database, EnquiryStatus } from "@/types/database";

type Enquiry = Database["public"]["Tables"]["enquiries"]["Row"];

export function EnquiriesTable({ enquiries }: { enquiries: Enquiry[] }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"active" | "deleted">("active");
  const { dict, locale } = useAdminDict();
  const router = useRouter();
  const dateLocale = locale === "kn" ? "kn-IN" : "en-IN";
  const t = dict.tables.enquiries;
  const statusOptions = (Object.keys(ENQUIRY_STATUS_LABELS) as EnquiryStatus[]).map((value) => ({
    value,
    label: dict.labels.enquiryStatus[value],
  }));

  // Live updates, two layers:
  // 1) Realtime push — instant, but depends on Supabase Realtime being
  //    enabled + reachable, which isn't guaranteed on every project setup.
  // 2) A 15s poll — guaranteed fallback so new enquiries always show up
  //    without a manual refresh, even if Realtime silently isn't delivering.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("enquiries-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "enquiries" }, () => {
        router.refresh();
      })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("Enquiries realtime channel failed to connect:", status);
        }
      });

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 15000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [router]);

  // Toast whenever fresh data brings in more rows than we last saw —
  // fires regardless of whether the refresh came from Realtime, the poll,
  // or a manual navigation.
  const prevCountRef = useRef(enquiries.length);
  useEffect(() => {
    if (enquiries.length > prevCountRef.current) {
      toast.info(t.newEnquiryReceived);
    }
    prevCountRef.current = enquiries.length;
  }, [enquiries.length, t.newEnquiryReceived]);

  const active = useMemo(() => enquiries.filter((e) => !e.deleted_at), [enquiries]);
  const deleted = useMemo(() => enquiries.filter((e) => e.deleted_at), [enquiries]);
  const source = tab === "active" ? active : deleted;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter((e) =>
      [e.company_name, e.contact_person, e.phone, e.location]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q)),
    );
  }, [source, query]);

  async function handleArchive(enquiry: Enquiry) {
    const result = await deleteEnquiry(enquiry.id);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(t.movedToDeleted, {
      action: {
        label: t.undo,
        onClick: async () => {
          const undoResult = await restoreEnquiry(enquiry.id);
          if (!undoResult.success) toast.error(undoResult.error);
        },
      },
    });
  }

  async function handleRestore(id: string) {
    const result = await restoreEnquiry(id);
    if (!result.success) toast.error(result.error);
    else toast.success(t.restored);
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit items-center rounded-full border border-border bg-secondary/50 p-0.5 text-sm font-medium">
          <button
            type="button"
            onClick={() => setTab("active")}
            className={cn(
              "rounded-full px-3 py-1.5 transition-colors",
              tab === "active" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.activeTab} ({active.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("deleted")}
            className={cn(
              "rounded-full px-3 py-1.5 transition-colors",
              tab === "deleted" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.deletedTab} ({deleted.length})
          </button>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="pl-9"
          />
        </div>
      </div>

      {tab === "deleted" ? <p className="mt-3 text-xs text-muted-foreground">{t.deletedHint}</p> : null}

      <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tab === "deleted" ? t.colDeletedOn : t.colReceived}</TableHead>
              <TableHead>{t.colOrganisation}</TableHead>
              <TableHead>{t.colContact}</TableHead>
              <TableHead>{t.colPhone}</TableHead>
              <TableHead>{t.colLocation}</TableHead>
              <TableHead>{t.colGuards}</TableHead>
              <TableHead>{t.colEmail}</TableHead>
              <TableHead>{t.colStatus}</TableHead>
              <TableHead className="text-right">{t.colActions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                  {tab === "deleted" ? t.noDeletedEnquiries : t.noEnquiries}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(tab === "deleted" ? enquiry.deleted_at! : enquiry.created_at).toLocaleDateString(dateLocale)}
                  </TableCell>
                  <TableCell className="font-medium">{enquiry.company_name}</TableCell>
                  <TableCell>{enquiry.contact_person}</TableCell>
                  <TableCell>{enquiry.phone}</TableCell>
                  <TableCell>{enquiry.location}</TableCell>
                  <TableCell>{enquiry.guard_count}</TableCell>
                  <TableCell>
                    {enquiry.email_sent ? (
                      <span className="text-xs font-medium text-success">{t.emailSent}</span>
                    ) : (
                      <span className="text-xs font-medium text-destructive">{t.emailNotSent}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {tab === "active" ? (
                      <InlineStatusSelect
                        value={enquiry.status}
                        options={statusOptions}
                        onChange={(status) => updateEnquiryStatus(enquiry.id, status)}
                      />
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground">
                        {dict.labels.enquiryStatus[enquiry.status]}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {tab === "active" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleArchive(enquiry)}
                          aria-label={t.archiveAriaLabel}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRestore(enquiry.id)}
                            aria-label={t.restoreAriaLabel}
                          >
                            <RotateCcw className="size-4" />
                          </Button>
                          <ConfirmDeleteButton
                            itemLabel={enquiry.company_name}
                            onConfirm={() => permanentlyDeleteEnquiry(enquiry.id)}
                          />
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
