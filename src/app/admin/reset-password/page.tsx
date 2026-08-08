"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import { LanguageToggle } from "@/components/admin/language-toggle";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dict } = useAdminDict();
  const [supabase] = useState(() => createClient());
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function init() {
      const code = searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setInvalid(true);
          return;
        }
        setReady(true);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setReady(true);
      } else {
        setInvalid(true);
      }
    }
    init();
  }, [searchParams, supabase]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success(dict.reset.success);
      router.replace("/admin");
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl sm:p-8">
      <div className="flex justify-end">
        <LanguageToggle />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <ShieldCheck className="size-6" />
        </span>
        <h1 className="mt-2 text-xl font-bold text-foreground">{dict.reset.title}</h1>
        <p className="text-sm text-muted-foreground">{dict.reset.subtitle}</p>
      </div>

      {invalid ? (
        <p className="mt-8 text-center text-sm text-destructive">{dict.reset.invalid}</p>
      ) : !ready ? (
        <div className="mt-8 flex justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-password">{dict.reset.newPassword}</Label>
            <Input
              id="new-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full gap-2" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {isPending ? dict.reset.submitting : dict.reset.submit}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1a2b] px-4 py-8">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
