"use client";

import * as React from "react";
import { IconShield, IconX } from "@/components/ui/icons";

export function SiteFooter() {
  const year = new Date().getFullYear();
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
            Calm, secure evidence organization. Not a law firm. Not legal advice.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Product
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><a href="#how" className="text-muted-foreground hover:text-foreground">How it works</a></li>
            <li><a href="security" className="text-muted-foreground hover:text-foreground">Security</a></li>
            <li><a href="verification" className="text-muted-foreground hover:text-foreground">Verification</a></li>
            <li><a href="lawyer-review" className="text-muted-foreground hover:text-foreground">Lawyer review</a></li>
            <li><a href="pricing" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Legal
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><a href="privacy" className="text-muted-foreground hover:text-foreground">Privacy</a></li>
            <li><a href="terms" className="text-muted-foreground hover:text-foreground">Terms</a></li>
            <li><a href="#disclaimer" className="text-muted-foreground hover:text-foreground">Not legal advice</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Regions
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Currently available in Kuwait (KW) and Jordan (JO). Additional jurisdictions are
            gated on local legal review.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <IconX size={12} className="opacity-50" />
            © {year} LegalShield.
          </div>
          <div>Not a law firm. Not legal advice. AI output is observational.</div>
        </div>
      </div>
    </footer>
  );
}
