"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AccessibilityContext,
  defaultAccessibilityState,
  type AccessibilityState,
} from "@/hooks/use-accessibility";

const STORAGE_KEY = "jss-a11y-prefs";

const FONT_SCALE_MIN = 0.85;
const FONT_SCALE_MAX = 1.5;
const FONT_SCALE_STEP = 0.1;

const LETTER_SPACING_MAX = 0.12;
const LETTER_SPACING_STEP = 0.02;

const WORD_SPACING_MAX = 0.5;
const WORD_SPACING_STEP = 0.1;

const LINE_HEIGHT_MAX = 2.2;
const LINE_HEIGHT_STEP = 0.1;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number(value.toFixed(2))));
}

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AccessibilityState>(
    defaultAccessibilityState,
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // One-time hydration from localStorage on mount, not derived state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({ ...defaultAccessibilityState, ...JSON.parse(raw) });
      }
    } catch {
      // ignore malformed local storage state
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.style.setProperty("--a11y-font-scale", String(state.fontScale));
    root.style.setProperty(
      "--a11y-letter-spacing",
      `${state.letterSpacing}em`,
    );
    root.style.setProperty("--a11y-word-spacing", `${state.wordSpacing}em`);
    root.style.setProperty("--a11y-line-height", String(state.lineHeight));
    root.classList.toggle("a11y-high-contrast", state.highContrast);
    root.classList.toggle("a11y-reading-mode", state.readingMode);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage may be unavailable (private browsing) - safe to ignore
    }
  }, [state, hydrated]);

  const increaseFontSize = useCallback(() => {
    setState((s) => ({
      ...s,
      fontScale: clamp(s.fontScale + FONT_SCALE_STEP, FONT_SCALE_MIN, FONT_SCALE_MAX),
    }));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setState((s) => ({
      ...s,
      fontScale: clamp(s.fontScale - FONT_SCALE_STEP, FONT_SCALE_MIN, FONT_SCALE_MAX),
    }));
  }, []);

  const increaseLetterSpacing = useCallback(() => {
    setState((s) => ({
      ...s,
      letterSpacing: clamp(
        s.letterSpacing + LETTER_SPACING_STEP >= LETTER_SPACING_MAX + 0.001
          ? 0
          : s.letterSpacing + LETTER_SPACING_STEP,
        0,
        LETTER_SPACING_MAX,
      ),
    }));
  }, []);

  const increaseWordSpacing = useCallback(() => {
    setState((s) => ({
      ...s,
      wordSpacing: clamp(
        s.wordSpacing + WORD_SPACING_STEP >= WORD_SPACING_MAX + 0.001
          ? 0
          : s.wordSpacing + WORD_SPACING_STEP,
        0,
        WORD_SPACING_MAX,
      ),
    }));
  }, []);

  const increaseLineHeight = useCallback(() => {
    setState((s) => ({
      ...s,
      lineHeight: clamp(
        s.lineHeight + LINE_HEIGHT_STEP > LINE_HEIGHT_MAX
          ? 1.4
          : s.lineHeight + LINE_HEIGHT_STEP,
        1.4,
        LINE_HEIGHT_MAX,
      ),
    }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setState((s) => ({ ...s, highContrast: !s.highContrast }));
  }, []);

  const toggleReadingMode = useCallback(() => {
    setState((s) => ({ ...s, readingMode: !s.readingMode }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultAccessibilityState);
  }, []);

  const value = useMemo(
    () => ({
      state,
      increaseFontSize,
      decreaseFontSize,
      increaseLetterSpacing,
      increaseWordSpacing,
      increaseLineHeight,
      toggleHighContrast,
      toggleReadingMode,
      reset,
    }),
    [
      state,
      increaseFontSize,
      decreaseFontSize,
      increaseLetterSpacing,
      increaseWordSpacing,
      increaseLineHeight,
      toggleHighContrast,
      toggleReadingMode,
      reset,
    ],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}
