"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/actions/admin/auth";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import { LanguageToggle } from "@/components/admin/language-toggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const { dict } = useAdminDict();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await signIn(email, password);
      if (result.success) {
        router.replace("/admin");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1a2b] px-4 py-8">
      <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl sm:p-8">
        <div className="flex justify-end">
          <LanguageToggle />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-6" />
          </span>
          <h1 className="mt-2 text-xl font-bold text-foreground">{dict.login.title}</h1>
          <p className="text-sm text-muted-foreground">{dict.login.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">{dict.login.email}</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@jyothisecurityservices.in"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{dict.login.password}</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full gap-2" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {isPending ? dict.login.submitting : dict.login.submit}
          </Button>
        </form>
      </div>
    </div>
  );
}
