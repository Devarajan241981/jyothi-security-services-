"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function SuccessScreen({
  title,
  message,
  backLabel,
}: {
  title: string;
  message: string;
  backLabel: string;
}) {
  return (
    <section className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="container-site flex max-w-lg flex-col items-center gap-5 text-center">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="flex size-20 items-center justify-center rounded-full bg-success/10 text-success"
        >
          <CheckCircle2 className="size-11" strokeWidth={1.6} />
        </motion.span>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{message}</p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/">{backLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
