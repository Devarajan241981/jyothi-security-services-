"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function WizardShell({
  step,
  totalSteps,
  heading,
  subheading,
  stepLabel,
  onNext,
  onBack,
  onSkip,
  canSkip = false,
  isLastStep = false,
  isSubmitting = false,
  showNextButton = true,
  children,
  illustration,
}: {
  step: number;
  totalSteps: number;
  heading: string;
  subheading: string;
  stepLabel: string;
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  canSkip?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  showNextButton?: boolean;
  children: React.ReactNode;
  illustration?: React.ReactNode;
}) {
  const tc = useTranslations("common");
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <section className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        {step === 0 ? (
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{heading}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{subheading}</p>
          </div>
        ) : null}

        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground sm:text-sm">
            <span>{stepLabel}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="mt-2 h-2" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onNext();
          }}
          className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8"
        >
          {illustration ? (
            <div className="mb-4 flex justify-center">{illustration}</div>
          ) : null}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.12 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={step === 0 || isSubmitting}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              {tc("back")}
            </Button>

            <div className="flex items-center gap-2">
              {canSkip ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={isLastStep ? onNext : onSkip}
                  disabled={isSubmitting}
                >
                  {tc("skip")}
                </Button>
              ) : null}
              {showNextButton ? (
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {tc("submitting")}
                    </>
                  ) : isLastStep ? (
                    tc("submit")
                  ) : (
                    <>
                      {tc("next")}
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Select an option to continue
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
