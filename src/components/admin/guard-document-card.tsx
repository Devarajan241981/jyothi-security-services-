"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { FileText, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGuardDocumentUrl, uploadGuardDocument } from "@/lib/actions/admin/guards";
import { useAdminDict } from "@/lib/admin-i18n/provider";

export function GuardDocumentCard({
  guardId,
  field,
  label,
  path,
}: {
  guardId: string;
  field: "aadhaar_path" | "photo_path";
  label: string;
  path: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isViewing, setIsViewing] = useState(false);
  const { dict } = useAdminDict();

  function handleFile(file: File | null) {
    if (!file) return;
    startTransition(async () => {
      const result = await uploadGuardDocument(guardId, field, file);
      if (result.success) {
        toast.success(`${label} uploaded.`);
      } else {
        toast.error(result.error);
      }
    });
  }

  async function handleView() {
    if (!path) return;
    setIsViewing(true);
    const result = await getGuardDocumentUrl(path);
    setIsViewing(false);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-4">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          {path ? dict.common.uploaded : dict.common.notUploadedYet}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        {path ? (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleView} disabled={isViewing}>
            {isViewing ? <Loader2 className="size-3.5 animate-spin" /> : <FileText className="size-3.5" />}
            {dict.common.view}
          </Button>
        ) : null}
        <Button
          variant={path ? "ghost" : "default"}
          size="sm"
          className="gap-1.5"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <UploadCloud className="size-3.5" />
          )}
          {path ? dict.common.replace : dict.common.upload}
        </Button>
      </div>
    </div>
  );
}
