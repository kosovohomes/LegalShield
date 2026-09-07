"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function IconShield({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="M12 2.5 4.5 5.5v6c0 4.5 3 8 7.5 10 4.5-2 7.5-5.5 7.5-10v-6L12 2.5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconLock({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function IconFile({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

export function IconClock({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconWallet({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M16 13h2" />
      <path d="M3 10h18" />
    </svg>
  );
}

export function IconSparkles({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconArrowRight({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

export function IconArrowLeft({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="M19 12H5" />
      <path d="m11 19-7-7 7-7" />
    </svg>
  );
}

export function IconCheck({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="m5 12 5 5 9-11" />
    </svg>
  );
}

export function IconX({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconPlus({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconSearch({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconCompass({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-2 5-5 2 2-5z" />
    </svg>
  );
}

export function IconBook({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 0-2 2z" />
      <path d="M4 19a2 2 0 0 0 2 2h12" />
    </svg>
  );
}

export function IconUsers({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 19a6.5 6.5 0 0 1 13 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 19a5 5 0 0 1 5.5-5" />
    </svg>
  );
}

export function IconUpload({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="M12 3v13" />
      <path d="m6 9 6-6 6 6" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

export function IconSend({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="m21 3-9 9" />
      <path d="m21 3-7 18-4-8-8-4z" />
    </svg>
  );
}

export function IconMenu({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function IconSun({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </svg>
  );
}

export function IconMoon({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" />
    </svg>
  );
}

export function IconDownload({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="M12 3v13" />
      <path d="m6 11 6 6 6-6" />
      <path d="M4 21h16" />
    </svg>
  );
}

export function IconKey({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <circle cx="8" cy="14" r="4" />
      <path d="m11 11 9-9" />
      <path d="m17 5 3 3" />
      <path d="m14 8 2 2" />
    </svg>
  );
}

export function IconMail({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function IconAlert({ size = 18, className, ...props }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)} {...props}>
      <path d="M12 3 2 21h20z" />
      <path d="M12 10v5" />
      <path d="M12 18h.01" />
    </svg>
  );
}
