"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/ui/disclaimer";
import { IconArrowRight, IconShield, IconLock, IconFile, IconCheck, IconSparkles } from "@/components/ui/icons";
import { Stagger, StaggerItem } from "@/components/motion-primitives";

export function Hero({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden pt-20 pb-24">
      <div className="aurora" aria-hidden />
      <div className="grid-bg absolute inset-0 opacity-40" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-6">
        <Stagger className="flex flex-col items-center text-center">
          <StaggerItem>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              {t("hero.badge")}
            </span>
          </StaggerItem>

          <StaggerItem>
            <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-6xl">
              {t("hero.title")}
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-5 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground">
              {t("hero.subtitle")}
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="xl">
                <Link href={`/${locale}/cases/new`} className="gap-2">
                  {t("hero.ctaPrimary")}
                  <IconArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href={`/${locale}/how`}>{t("hero.ctaSecondary")}</Link>
              </Button>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-10 max-w-3xl">
              <Disclaimer tone="info">
                {t("boundaries.is")} {t("boundaries.isNot")}
              </Disclaimer>
            </div>
          </StaggerItem>
        </Stagger>

        {/* Floating product preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-20 max-w-4xl"
        >
          <Preview />
        </motion.div>
      </div>
    </section>
  );
}

function Preview() {
  return (
    <div className="relative rounded-3xl border border-border/70 bg-card/60 p-1 shadow-[0_30px_120px_-30px_hsl(var(--primary)/0.4)] backdrop-blur-xl">
      <div className="overflow-hidden rounded-[1.4rem] border border-border/60 bg-background/80">
        <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/30 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
          <span className="ms-3 text-xs text-muted-foreground">legalshield.app/dashboard</span>
        </div>
        <div className="grid grid-cols-1 gap-px bg-border/60 md:grid-cols-[200px_1fr]">
          <aside className="flex flex-col gap-1 bg-background/80 p-4 text-sm">
            {["Overview", "Evidence", "Timeline", "Expenses", "Requests", "Verification", "Export"].map(
              (label, i) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${
                    i === 1
                      ? "bg-primary/10 text-foreground ring-1 ring-primary/20"
                      : "text-muted-foreground"
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-current opacity-50" />
                  {label}
                </div>
              ),
            )}
          </aside>
          <div className="space-y-3 bg-background/80 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Case · KW-2024-118</div>
                <div className="text-lg font-semibold">Al-Sabah v. Vendor</div>
              </div>
              <span className="rounded-full bg-[hsl(var(--flag-verified)/0.18)] px-2.5 py-0.5 text-[11px] text-[hsl(var(--flag-verified))] ring-1 ring-[hsl(var(--flag-verified)/0.35)] ring-inset">
                verified
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { i: <IconFile size={14} />, l: "Evidence", v: 42 },
                { i: <IconLock size={14} />, l: "Encrypted", v: 42 },
                { i: <IconCheck size={14} />, l: "Hashed", v: 42 },
              ].map((c) => (
                <div
                  key={c.l}
                  className="rounded-xl border border-border/60 bg-card/60 p-3"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {c.l}
                    <span className="text-foreground/70">{c.i}</span>
                  </div>
                  <div className="mt-2 text-2xl font-semibold tabular-nums">{c.v}</div>
                </div>
              ))}
            </div>
            <div className="space-y-1.5 rounded-xl border border-border/60 bg-card/60 p-3">
              {[
                { w: 88, c: "verified" },
                { w: 64, c: "ai" },
                { w: 42, c: "allegation" },
                { w: 72, c: "observation" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <span className="w-20 text-muted-foreground">item {i + 1}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${row.w}%` }}
                    />
                  </div>
                  <span className="w-16 text-end text-muted-foreground">{row.c}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3 text-xs">
              <span className="flex items-center gap-2 text-foreground">
                <IconSparkles size={14} className="text-primary" />
                AI observation: alignment differs across two regions
              </span>
              <span className="text-muted-foreground">not a verdict</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
