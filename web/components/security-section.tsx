"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconShield, IconLock, IconCheck } from "@/components/ui/icons";
import { Stagger, StaggerItem } from "@/components/motion-primitives";

const promises = ["promise.cse", "promise.noForge", "promise.noVerdict", "promise.export", "promise.delete"] as const;

export function SecuritySection({ locale }: { locale: string }) {
  const t = useTranslations();
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-card/20 py-24">
      <div className="aurora aurora-slow" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-6">
        <Stagger className="grid items-center gap-12 lg:grid-cols-2">
          <StaggerItem>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {t("security.eyebrow")}
            </span>
            <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight">
              {t("security.title")}
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              {t("security.subtitle")}
            </p>
            <ul className="mt-8 space-y-3">
              {promises.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 place-items-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                    <IconCheck size={12} />
                  </span>
                  <div>
                    <div className="text-sm font-medium">
                      {t(`security.${p}.title`)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t(`security.${p}.body`)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-8 gap-2">
              <Link href={`/${locale}/security`}>
                {t("security.cta")}
                <IconArrowRight size={16} />
              </Link>
            </Button>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              initial={{ rotate: 2, scale: 0.95 }}
              whileInView={{ rotate: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative rounded-3xl border border-border/70 bg-card/80 p-8 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                <div className="absolute -top-6 -end-6 grid size-14 place-items-center rounded-2xl bg-primary/20 text-primary ring-1 ring-primary/30">
                  <IconShield size={24} />
                </div>
                <div className="absolute -bottom-6 -start-6 grid size-14 place-items-center rounded-2xl bg-card/80 text-foreground ring-1 ring-border backdrop-blur-xl">
                  <IconLock size={22} />
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  $ post /api/evidence
                </div>
                <pre className="mt-3 overflow-x-auto rounded-xl border border-border/60 bg-background/60 p-4 text-[11px] leading-relaxed text-foreground/80">
{`{
  "filename": "receipt-2024-04-01.pdf",
  "sha256": "9f86d081884c7d65…",
  "encryption": {
    "scheme": "AES-256-GCM",
    "keyWrap": "user-managed recovery key"
  },
  "stored": {
    "bytes": "encrypted",
    "plaintext": "never leaves device"
  }
}`}
                </pre>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {["RLS on every table", "Private storage", "Append-only audit", "Versioned templates"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
