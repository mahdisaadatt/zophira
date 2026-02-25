"use client";

import React from "react";

type LoadingProps = {
  fullScreen?: boolean;
  label?: string;
  className?: string;
};

export function Loading({ fullScreen = false, label, className }: LoadingProps) {
  return (
    <div
      className={[
        "w-full flex items-center justify-center",
        fullScreen
          ? "min-h-[60vh] sm:min-h-[70vh] lg:min-h-[60vh]"
          : "py-24",
        className || "",
      ].join(" ")}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin" />
        {label ? (
          <span className="text-sm text-muted-foreground">{label}</span>
        ) : null}
      </div>
    </div>
  );
}

export default Loading;
