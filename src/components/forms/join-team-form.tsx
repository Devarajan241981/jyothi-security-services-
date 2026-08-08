"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  applicationSchema,
  type ApplicationInput,
} from "@/lib/validations/application";
import { languageSlugs } from "@/lib/validations/enquiry";
import { submitApplication } from "@/lib/actions/application-actions";
import { WizardShell } from "@/components/forms/wizard-shell";
import { SelectableCard } from "@/components/forms/selectable-card";
import { SuccessScreen } from "@/components/forms/success-screen";
import { FileInput } from "@/components/forms/file-input";
import { PhoneDigitInput } from "@/components/forms/phone-digit-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const STEP_FIELDS: (keyof ApplicationInput)[][] = [
  ["fullName"],
  ["age"],
  ["phone"],
  ["address"],
  ["experience"],
  ["languages"],
  [],
];

const TOTAL_STEPS = STEP_FIELDS.length;
const SKIPPABLE_STEPS = new Set([4, 5, 6]);

export function JoinTeamForm() {
  const t = useTranslations("joinForm");
  const tLang = useTranslations("requestForm.languages");
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [aadhaar, setAadhaar] = useState<File | null>(null);

  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      age: 0,
      phone: "",
      address: "",
      experience: "",
      languages: [],
      website: "",
    } as ApplicationInput,
  });

  const { watch, setValue, trigger, handleSubmit } = form;
  const values = watch();
  const isLastStep = step === TOTAL_STEPS - 1;

  async function goNext() {
    const fields = STEP_FIELDS[step];
    if (fields.length) {
      const valid = await trigger(fields, { shouldFocus: true });
      if (!valid) return;
    }

    if (!isLastStep) {
      setStep((s) => s + 1);
      return;
    }

    handleSubmit(async (data) => {
      startTransition(async () => {
        try {
          const formData = new FormData();
          formData.set("fullName", data.fullName);
          formData.set("age", String(data.age));
          formData.set("phone", data.phone);
          formData.set("address", data.address);
          formData.set("experience", data.experience ?? "");
          formData.set("website", data.website ?? "");
          (data.languages ?? []).forEach((lang) => formData.append("languages", lang));
          if (aadhaar) formData.set("aadhaar", aadhaar);

          const result = await submitApplication(formData);
          if (result.success) {
            setSubmitted(true);
          } else {
            toast.error(result.error);
          }
        } catch {
          // Most commonly a stale Server Action reference after a redeploy —
          // the click must never silently do nothing.
          toast.error(
            "Something went wrong submitting your application. Please refresh the page and try again, or call us directly.",
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
    >
      {step === 0 ? (
        <StepBlock question={t("steps.fullName.question")}>
          <Input
            autoFocus
            value={values.fullName}
            onChange={(e) => setValue("fullName", e.target.value, { shouldValidate: true })}
            placeholder={t("steps.fullName.placeholder")}
            className="h-12 text-base"
          />
        </StepBlock>
      ) : null}

      {step === 1 ? (
        <StepBlock question={t("steps.age.question")}>
          <Input
            autoFocus
            type="number"
            inputMode="numeric"
            value={values.age || ""}
            onChange={(e) => setValue("age", Number(e.target.value), { shouldValidate: true })}
            placeholder={t("steps.age.placeholder")}
            className="h-12 text-base"
          />
        </StepBlock>
      ) : null}

      {step === 2 ? (
        <StepBlock question={t("steps.phone.question")}>
          <PhoneDigitInput
            autoFocus
            value={values.phone}
            onChange={(v) => setValue("phone", v, { shouldValidate: true })}
          />
        </StepBlock>
      ) : null}

      {step === 3 ? (
        <StepBlock question={t("steps.address.question")}>
          <Textarea
            autoFocus
            value={values.address}
            onChange={(e) => setValue("address", e.target.value, { shouldValidate: true })}
            placeholder={t("steps.address.placeholder")}
            className="min-h-32 text-base"
          />
        </StepBlock>
      ) : null}

      {step === 4 ? (
        <StepBlock question={t("steps.experience.question")}>
          <Textarea
            autoFocus
            value={values.experience}
            onChange={(e) => setValue("experience", e.target.value)}
            placeholder={t("steps.experience.placeholder")}
            className="min-h-32 text-base"
          />
        </StepBlock>
      ) : null}

      {step === 5 ? (
        <StepBlock question={t("steps.languages.question")}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {languageSlugs.map((lang) => {
              const isSelected = values.languages?.includes(lang);
              return (
                <SelectableCard
                  key={lang}
                  label={tLang(lang)}
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

      {step === 6 ? (
        <StepBlock question={t("steps.aadhaar.question")} helper={t("steps.aadhaar.helper")}>
          <FileInput file={aadhaar} onChange={setAadhaar} />
        </StepBlock>
      ) : null}
    </WizardShell>
  );
}

function StepBlock({
  question,
  helper,
  children,
}: {
  question: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-xl font-semibold text-foreground sm:text-2xl">{question}</Label>
      {helper ? <p className="mt-2 text-sm text-muted-foreground">{helper}</p> : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}
