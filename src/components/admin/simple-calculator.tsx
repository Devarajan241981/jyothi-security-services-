"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAdminDict } from "@/lib/admin-i18n/provider";

const buttons = [
  "7", "8", "9", "÷",
  "4", "5", "6", "×",
  "1", "2", "3", "−",
  "0", ".", "=", "+",
];

export function SimpleCalculator() {
  const [display, setDisplay] = useState("0");
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const [pendingOperator, setPendingOperator] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState(true);
  const { dict } = useAdminDict();

  function applyOperator(a: number, b: number, operator: string) {
    switch (operator) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? NaN : a / b;
      default: return b;
    }
  }

  function handlePress(key: string) {
    if (key === "C") {
      setDisplay("0");
      setPendingValue(null);
      setPendingOperator(null);
      setOverwrite(true);
      return;
    }

    if (/[0-9.]/.test(key)) {
      if (overwrite) {
        setDisplay(key === "." ? "0." : key);
        setOverwrite(false);
      } else if (key === "." && display.includes(".")) {
        return;
      } else {
        setDisplay(display + key);
      }
      return;
    }

    const current = parseFloat(display);

    if (key === "=") {
      if (pendingOperator && pendingValue !== null) {
        const result = applyOperator(pendingValue, current, pendingOperator);
        setDisplay(String(result));
        setPendingValue(null);
        setPendingOperator(null);
        setOverwrite(true);
      }
      return;
    }

    // Operator pressed
    if (pendingOperator && pendingValue !== null && !overwrite) {
      const result = applyOperator(pendingValue, current, pendingOperator);
      setDisplay(String(result));
      setPendingValue(result);
    } else {
      setPendingValue(current);
    }
    setPendingOperator(key);
    setOverwrite(true);
  }

  return (
    <div className="mx-auto w-full max-w-xs rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 rounded-2xl bg-[#0f1a2b] px-4 py-5 text-right">
        <div className="h-5 truncate text-sm font-medium text-white/50">
          {pendingOperator && pendingValue !== null ? `${pendingValue} ${pendingOperator}` : " "}
        </div>
        <div className="mt-1 truncate text-3xl font-bold text-white">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Button variant="outline" className="col-span-4" onClick={() => handlePress("C")}>
          {dict.common.clear}
        </Button>
        {buttons.map((key) => (
          <Button
            key={key}
            variant={/[÷×−+=]/.test(key) ? "default" : "secondary"}
            className="h-12 text-lg"
            onClick={() => handlePress(key)}
          >
            {key}
          </Button>
        ))}
      </div>
    </div>
  );
}
