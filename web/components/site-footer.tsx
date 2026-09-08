"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IconShield, IconX } from "@/components/ui/icons";
import type { ChromeLabels } from "@/components/marketing-chrome";

const FOOTER_FALLBACKS: Record<string, string> = {
  tagline: "Calm, secure evidence organization. Not a law firm. Not legal advice.",
  product: "Product",
  legal: "Legal",
  regions: "Regions",
  regionsBody:
    "Currently available in Kuwait (KW) and Jordan (JO). Additional jurisdictions are gated on local legal review.",
  privacy: "Privacy",
  terms: "Terms",
  disclaimer: "Not legal advice",
  copyright: "© {year} LegalShield.",
  notLawFirm: "Not a law firm. Not legal advice. AI output is observational.",
};

const NAV_FALLBACKS: Record<string, string> = {
  how: "How it works",
  security: "Security",
  verification: "Verification",
  "lawyer-review": "Lawyer review",
  rights: "Client rights",
  pricing: "Pricing",
  about: "About",
  contact: "Contact",
};

export function SiteFooter({ labels }: { labels?: ChromeLabels }) {
  const { locale } = useParams<{ locale: string }>();
  const prefix = locale ? `/${locale}` : "";
  const year = new Date().getFullYear();

  const m = (key: string) => labels?.footer?.[key] ?? FOOTER_FALLBACKS[key] ?? key;
  const navLabel = (key: string) => labels?.nav?.[key] ?? NAV_FALLBACKS[key] ?? key;

  const productLinks = [
    { href: "how", label: navLabel("how") },
    { href: "security", label: navLabel("security") },
    { href: "verification", label: navLabel("verification") },
    { href: "lawyer-review", label: navLabel("lawyer-review") },
    { href: "rights", label: navLabel("rights") },
    { href: "pricing", label: navLabel("pricing") },
  ];
  const legalLinks = [
    { href: "privacy", label: m("privacy") },
    { href: "terms", label: m("terms") },
  ];
  const copyright = m("copyright").replace("{year}", String(year));

  return (
    <footer className="relative border-t border-border/60 bg-card/30 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid size-7 place-items-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
              <IconShield size={14} />
            </span>
            LegalShield
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {m("tagline")}
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {m("product")}
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {productLinks.map((l) => (
              <li key={l.href}>
                <Link href={`${prefix}/${l.href}`} className="text-muted-foreground hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {m("legal")}
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={`${prefix}/${l.href}`} className="text-muted-foreground hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="#disclaimer" className="text-muted-foreground hover:text-foreground">
                {m("disclaimer")}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {m("regions")}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {m("regionsBody")}
          </p>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <IconX size={12} className="opacity-50" />
            {copyright}
          </div>
          <div>{m("notLawFirm")}</div>
        </div>
      </div>
    </footer>
  );
}