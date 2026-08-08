"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Users } from "lucide-react";
import {
  enquirySchema,
  type EnquiryInput,
  guardTypes,
  shiftTypes,
  languageSlugs,
} from "@/lib/validations/enquiry";
import { requestGuardTypes } from "@/lib/constants/site";
import { submitEnquiry } from "@/lib/actions/enquiry-actions";
import { WizardShell } from "@/components/forms/wizard-shell";
import { SelectableCard } from "@/components/forms/selectable-card";
import { PremisesIllustration } from "@/components/forms/premises-illustration";
import { SuccessScreen } from "@/components/forms/success-screen";
import { PhoneDigitInput } from "@/components/forms/phone-digit-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const STEP_FIELDS: (keyof EnquiryInput)[][] = [
  ["premisesType"],
  ["companyName"],
  ["contactPerson"],
  ["phone"],
  ["email"],
  ["location"],
  ["guardCount"],
  ["guardType"],
  ["preferredAge"],
  ["languages"],
  ["shift"],
  ["additionalRequirements"],
];

const TOTAL_STEPS = STEP_FIELDS.length;
const SKIPPABLE_STEPS = new Set([4, 8, 9]);
const AUTO_ADVANCE_STEPS = new Set([0, 7, 10]);

export function RequestGuardsForm() {
  const t = useTranslations("requestForm");
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    mode: "onChange",
    defaultValues: {
      companyName: "",
      contactPerson: "",
      phone: "",
      email: "",
      location: "",
      guardCount: 4,
      preferredAge: "",
      languages: [],
      additionalRequirements: "",
      website: "",
    } as unknown as EnquiryInput,
  });

  const { watch, setValue, trigger, handleSubmit } = form;
  const values = watch();
  const isLastStep = step === TOTAL_STEPS - 1;

  const selectedIllustrationIcon = useMemo(() => {
    const match = requestGuardTypes.find((p) => p.slug === values.premisesType);
    return match?.icon ?? "ShieldCheck";
  }, [values.premisesType]);

  async function goNext() {
    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields, { shouldFocus: true });
    if (!valid) return;

    if (!isLastStep) {
      setStep((s) => s + 1);
      return;
    }

    handleSubmit(async (data) => {
      startTransition(async () => {
        try {
          const result = await submitEnquiry(data);
          if (result.success) {
            setSubmitted(true);
          } else {
            toast.error(result.error);
          }
        } catch {
          // Most commonly a stale Server Action reference after a redeploy —
          // the click must never silently do nothing.
          toast.error(
            "Something went wrong submitting your request. Please refresh the page and try again, or call us directly.",
          );
        }
      });
    })();
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  function goSkip() {
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  }

  function selectAndAdvance<K extends keyof EnquiryInput>(field: K, value: EnquiryInput[K]) {
    setValue(field, value as never, { shouldValidate: true });
    window.setTimeout(() => {
      setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
    }, 130);
  }

  if (submitted) {
    return (
      <SuccessScreen
        title={t("successTitle")}
        message={t("successMessage")}
        backLabel={t("backToHome")}
      />
    );
  }

  return (
    <WizardShell
      step={step}
      totalSteps={TOTAL_STEPS}
      heading={t("heading")}
      subheading={t("subheading")}
      stepLabel={t("step", { current: step + 1, total: TOTAL_STEPS })}
      onNext={goNext}
      onBack={goBack}
      onSkip={goSkip}
      canSkip={SKIPPABLE_STEPS.has(step)}
      isLastStep={isLastStep}
      isSubmitting={isPending}
      showNextButton={!AUTO_ADVANCE_STEPS.has(step)}
      illustration={<PremisesIllustration icon={selectedIllustrationIcon} />}
    >
      {step === 0 ? (
        <StepBlock question={t("steps.premisesType.question")} helper={t("steps.premisesType.helper")} compact>
          <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5">
            {requestGuardTypes.map((p) => (
              <SelectableCard
                key={p.slug}
                compact
                label={t(`premisesTypes.${p.slug}`)}
                icon={p.icon}
                selected={values.premisesType === p.slug}
                onClick={() => selectAndAdvance("premisesType", p.slug)}
              />
            ))}
          </div>
        </StepBlock>
      ) : null}

      {step === 1 ? (
        <StepBlock question={t("steps.companyName.question")}>
          <Input
            autoFocus
            value={values.companyName}
            onChange={(e) => setValue("companyName", e.target.value, { shouldValidate: true })}
            placeholder={t("steps.companyName.placeholder")}
            className="h-12 text-base"
          />
        </StepBlock>
      ) : null}

      {step === 2 ? (
        <StepBlock question={t("steps.contactPerson.question")}>
          <Input
            autoFocus
            value={values.contactPerson}
            onChange={(e) => setValue("contactPerson", e.target.value, { shouldValidate: true })}
            placeholder={t("steps.contactPerson.placeholder")}
            className="h-12 text-base"
          />
        </StepBlock>
      ) : null}

      {step === 3 ? (
        <StepBlock question={t("steps.phone.question")}>
          <PhoneDigitInput
            autoFocus
            value={values.phone}
            onChange={(v) => setValue("phone", v, { shouldValidate: true })}
          />
        </StepBlock>
      ) : null}

      {step === 4 ? (
        <StepBlock question={t("steps.email.question")}>
          <Input
            autoFocus
            type="email"
            value={values.email}
            onChange={(e) => setValue("email", e.target.value, { shouldValidate: true })}
            placeholder={t("steps.email.placeholder")}
            className="h-12 text-base"
          />
        </StepBlock>
      ) : null}

      {step === 5 ? (
        <StepBlock question={t("steps.location.question")}>
          <Input
            autoFocus
            value={values.location}
            onChange={(e) => setValue("location", e.target.value, { shouldValidate: true })}
            placeholder={t("steps.location.placeholder")}
            className="h-12 text-base"
          />
        </StepBlock>
      ) : null}

      {step === 6 ? (
        <StepBlock question={t("steps.guardCount.question")} helper={t("steps.guardCount.helper")}>
          <div className="flex flex-col items-center gap-4 py-3">
            <span className="text-4xl font-extrabold text-primary">{values.guardCount}</span>
            <Slider
              value={[values.guardCount]}
              min={1}
              max={50}
              step={1}
              onValueChange={([v]) => setValue("guardCount", v, { shouldValidate: true })}
              className="w-full max-w-sm"
            />
          </div>
        </StepBlock>
      ) : null}

      {step === 7 ? (
        <StepBlock question={t("steps.guardType.question")}>
          <div className="grid grid-cols-3 gap-2">
            {guardTypes.map((g) => (
              <SelectableCard
                key={g}
                label={t(`guardTypes.${g}`)}
                selected={values.guardType === g}
                onClick={() => selectAndAdvance("guardType", g)}
              />
            ))}
          </div>
        </StepBlock>
      ) : null}

      {step === 8 ? (
        <StepBlock question={t("steps.age.question")}>
          <Input
            autoFocus
            value={values.preferredAge}
            onChange={(e) => setValue("preferredAge", e.target.value)}
            placeholder={t("steps.age.placeholder")}
            className="h-12 text-base"
          />
        </StepBlock>
      ) : null}

      {step === 9 ? (
        <StepBlock question={t("steps.languages.question")}>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {languageSlugs.map((lang) => {
              const isSelected = values.languages?.includes(lang);
              return (
                <SelectableCard
                  key={lang}
                  label={t(`languages.${lang}`)}
                  selected={!!isSelected}
                  onClick={() => {
                    const current = values.languages ?? [];
                    setValue(
                      "languages",
                      isSelected ? current.filter((l) => l !== lang) : [...current, lang],
                    );
                  }}
                />
              );
            })}
          </div>
        </StepBlock>
      ) : null}

      {step === 10 ? (
        <StepBlock question={t("steps.shift.question")}>
          <div className="grid grid-cols-3 gap-2">
            {shiftTypes.map((s) => (
              <SelectableCard
                key={s}
                label={t(`shifts.${s}`)}
                selected={values.shift === s}
                onClick={() => selectAndAdvance("shift", s)}
              />
            ))}
          </div>
        </StepBlock>
      ) : null}

      {step === 11 ? (
        <StepBlock question={t("steps.additionalRequirements.question")}>
          <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-primary">
            <Users className="size-3.5 shrink-0" />
            <span>{values.companyName || t("steps.companyName.placeholder")}</span>
          </div>
          <Textarea
            autoFocus
            value={values.additionalRequirements}
            onChange={(e) => setValue("additionalRequirements", e.target.value)}
            placeholder={t("steps.additionalRequirements.placeholder")}
            className="mt-2 min-h-24 text-base"
          />
        </StepBlock>
      ) : null}
    </WizardShell>
  );
}

function StepBlock({
  question,
  helper,
  compact = false,
  children,
}: {
  question: string;
  helper?: string;
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label
        className={cn(
          "font-semibold text-foreground",
          compact ? "text-base sm:text-lg" : "text-lg sm:text-xl",
        )}
      >
        {question}
      </Label>
      {helper ? <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{helper}</p> : null}
      <div className={compact ? "mt-3" : "mt-4"}>{children}</div>
    </div>
  );
}
