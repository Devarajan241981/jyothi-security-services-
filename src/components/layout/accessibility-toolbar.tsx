"use client";

import { useTranslations } from "next-intl";
import {
  AArrowDown,
  AArrowUp,
  AlignHorizontalSpaceAround,
  Accessibility,
  BookOpenText,
  Contrast,
  RotateCcw,
  Space,
  WrapText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { useAccessibility } from "@/hooks/use-accessibility";

export function AccessibilityToolbar() {
  const t = useTranslations("accessibility");
  const {
    state,
    increaseFontSize,
    decreaseFontSize,
    increaseLetterSpacing,
    increaseWordSpacing,
    increaseLineHeight,
    toggleHighContrast,
    toggleReadingMode,
    reset,
  } = useAccessibility();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={t("toggleLabel")}
          className="rounded-full border-border bg-card shadow-sm"
        >
          <Accessibility className="size-5" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 space-y-3">
        <p className="text-sm font-semibold text-foreground">{t("heading")}</p>
        <Separator />

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">{t("fontSize")}</span>
          <div className="flex gap-1">
            <Button
              variant="secondary"
              size="icon"
              className="size-8"
              aria-label={t("decrease")}
              onClick={decreaseFontSize}
            >
              <AArrowDown className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="size-8"
              aria-label={t("increase")}
              onClick={increaseFontSize}
            >
              <AArrowUp className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">
            {t("letterSpacing")}
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="size-8"
            aria-label={t("letterSpacing")}
            onClick={increaseLetterSpacing}
          >
            <AlignHorizontalSpaceAround className="size-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">
            {t("wordSpacing")}
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="size-8"
            aria-label={t("wordSpacing")}
            onClick={increaseWordSpacing}
          >
            <Space className="size-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">{t("lineHeight")}</span>
          <Button
            variant="secondary"
            size="icon"
            className="size-8"
            aria-label={t("lineHeight")}
            onClick={increaseLineHeight}
          >
            <WrapText className="size-4" />
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">
            {t("highContrast")}
          </span>
          <Toggle
            pressed={state.highContrast}
            onPressedChange={toggleHighContrast}
            aria-label={t("highContrast")}
            size="sm"
          >
            <Contrast className="size-4" />
          </Toggle>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">
            {t("readingMode")}
          </span>
          <Toggle
            pressed={state.readingMode}
            onPressedChange={toggleReadingMode}
            aria-label={t("readingMode")}
            size="sm"
          >
            <BookOpenText className="size-4" />
          </Toggle>
        </div>

        <Separator />

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center gap-2 text-muted-foreground"
          onClick={reset}
        >
          <RotateCcw className="size-4" />
          {t("reset")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
