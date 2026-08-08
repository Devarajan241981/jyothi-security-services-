"use client";

import { createContext, useContext } from "react";

export type AccessibilityState = {
  fontScale: number;
  letterSpacing: number;
  wordSpacing: number;
  lineHeight: number;
  highContrast: boolean;
  readingMode: boolean;
};

export const defaultAccessibilityState: AccessibilityState = {
  fontScale: 1,
  letterSpacing: 0,
  wordSpacing: 0,
  lineHeight: 1.6,
  highContrast: false,
  readingMode: false,
};

export type AccessibilityContextValue = {
  state: AccessibilityState;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  increaseLetterSpacing: () => void;
  increaseWordSpacing: () => void;
  increaseLineHeight: () => void;
  toggleHighContrast: () => void;
  toggleReadingMode: () => void;
  reset: () => void;
};

export const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null,
);

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider",
    );
  }
  return ctx;
}
