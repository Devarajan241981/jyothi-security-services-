"use client";

import { useRef } from "react";
import { FileCheck2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FileInput({
  file,
  onChange,
  accept = "application/pdf,image/jpeg,image/png",
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-success/30 bg-success/10 px-4 py-3.5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <FileCheck2 className="size-5 shrink-0 text-success" />
            <span className="truncate text-sm font-medium text-foreground">
              {file.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Remove file"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="h-auto w-full flex-col gap-2 border-dashed py-8"
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className="size-6 text-primary" />
          <span className="text-sm font-medium">Click to upload</span>
          <span className="text-xs text-muted-foreground">PDF, JPG or PNG · Max 5 MB</span>
        </Button>
      )}
    </div>
  );
}
