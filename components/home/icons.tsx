import s from "./home.module.css";

// The A2 reference's line icons (24-unit grid, 2px stroke). "Forward" arrows point left for
// rtl; the `fwd` class mirrors them under ltr.

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" {...stroke} aria-hidden="true">
      <path d="M12 4v11" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}

export function DownArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" {...stroke} aria-hidden="true">
      <path d="M12 5v14" />
      <path d="M6 13l6 6 6-6" />
    </svg>
  );
}

export function ForwardArrow({ size = 20, width = 2, className = "" }: { size?: number; width?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={width}
      {...stroke}
      aria-hidden="true"
      className={`${s.fwd} ${className}`}
    >
      <path d="M19 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </svg>
  );
}

/** Her phone → his phone, dashed (the kicks tile). */
export function HandoffArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 24" strokeWidth="2" {...stroke} aria-hidden="true" className={`${s.fwd} ${className}`}>
      <path d="M54 12H4" strokeDasharray="4 5" />
      <path d="M10 5L3 12l7 7" />
    </svg>
  );
}
