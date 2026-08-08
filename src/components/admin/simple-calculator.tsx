"use client";

import { useEffect, useRef, useState } from "react";
import { History, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminDict } from "@/lib/admin-i18n/provider";

const buttons = [
  "7", "8", "9", "÷",
  "4", "5", "6", "×",
  "1", "2", "3", "−",
  "0", ".", "=", "+",
];

const STORAGE_KEY = "jss-admin-calc-history";
const MAX_HISTORY = 50;

type HistoryEntry = { id: string; expression: string; result: string };

export function SimpleCalculator() {
  const [display, setDisplay] = useState("0");
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const [pendingOperator, setPendingOperator] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const historyLoaded = useRef(false);
  const { dict } = useAdminDict();

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setHistory(JSON.parse(raw));
      } catch {
        // corrupted storage — start fresh
      }
      historyLoaded.current = true;
    }, 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!historyLoaded.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

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
        const resultText = String(result);
        setHistory((prev) =>
          [
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              expression: `${pendingValue} ${pendingOperator} ${current}`,
              result: resultText,
            },
            ...prev,
          ].slice(0, MAX_HISTORY),
        );
        setDisplay(resultText);
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

  function reuseEntry(entry: HistoryEntry) {
    setDisplay(entry.result);
    setPendingValue(null);
    setPendingOperator(null);
    setOverwrite(true);
  }

  function deleteEntry(id: string) {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }

  function clearHistory() {
    setHistory([]);
  }

  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
      <div className="w-full max-w-xs rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 rounded-2xl bg-[#0f1a2b] px-4 py-5 text-right">
          <div className="h-5 truncate text-sm font-medium text-white/50">
            {pendingOperator && pendingValue !== null ? `${pendingValue} ${pendingOperator}` : " "}
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

      <div className="w-full max-w-xs rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              {dict.pages.calculator.history}
            </h2>
          </div>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={clearHistory}>
              <Trash2 className="size-3.5" />
              {dict.pages.calculator.clearAll}
            </Button>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {dict.pages.calculator.historyHint}
        </p>

        {history.length === 0 ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {dict.pages.calculator.historyEmpty}
          </p>
        ) : (
          <ul className="mt-3 max-h-80 space-y-1.5 overflow-y-auto">
            {history.map((entry) => (
              <li
                key={entry.id}
                className="group flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-2"
              >
                <button
                  type="button"
                  onClick={() => reuseEntry(entry)}
                  className="min-w-0 flex-1 text-left"
                  title={dict.pages.calculator.historyHint}
                >
                  <span className="block truncate text-xs text-muted-foreground">
                    {entry.expression}
                  </span>
                  <span className="block truncate text-sm font-semibold text-foreground">
                    = {entry.result}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteEntry(entry.id)}
                  aria-label={dict.common.clear}
                  className="rounded-md p-1 text-muted-foreground opacity-60 transition hover:bg-destructive/10 hover:text-destructive hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
