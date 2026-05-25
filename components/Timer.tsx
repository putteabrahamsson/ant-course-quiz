"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  totalSeconds: number;
  onExpire: () => void;
  onTick?: (remainingSeconds: number) => void;
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const Timer = ({ totalSeconds, onExpire, onTick }: TimerProps) => {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }

    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        onTick?.(next);
        if (next <= 0) {
          clearInterval(id);
          onExpire();
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = (remaining / totalSeconds) * 100;
  const isWarning = remaining <= 300 && remaining > 60;
  const isDanger = remaining <= 60;

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`text-2xl font-mono font-bold tabular-nums transition-colors ${
          isDanger
            ? "text-red-500"
            : isWarning
              ? "text-amber-500"
              : "text-slate-700"
        }`}
      >
        {formatTime(remaining)}
      </div>
      <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isDanger
              ? "bg-red-500"
              : isWarning
                ? "bg-amber-400"
                : "bg-brand-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
