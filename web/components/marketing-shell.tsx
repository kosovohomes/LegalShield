"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconCheck } from "@/components/ui/icons";
import { Stagger, StaggerItem } from "@/components/motion-primitives";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  cta,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: { href: string; label: string };
}) {
  const t = useTranslations();
  return (
    <section className="relative overflow-hidden pt-20 pb-12">
      <div className="aurora" aria-hidden />
      <div className="grid-bg absolute inset-0 opacity-30" aria-hidden />
      <Stagger className="relative mx-auto flex max-w-3xl flex-col items-center text-center px-6">
        {eyebrow && (
          <StaggerItem>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </span>
          </StaggerItem>
        )}
        <StaggerItem>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
        </StaggerItem>
        {subtitle && (
          <StaggerItem>
            <p className="mt-4 max-w-2xl text-balance text-muted-foreground">{subtitle}</p>
          </StaggerItem>
        )}
        {cta && (
          <StaggerItem>
            <Button asChild size="lg" className="mt-7 gap-2">
              <Link href={cta.href}>
                {cta.label}
                <IconArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </Button>
          </StaggerItem>
        )}
      </Stagger>
    </section>
  );
}

export function ValueGrid({
  items,
}: {
  items: { title: string; body: string; icon?: React.ReactNode }[];
}) {
  return (
    <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <StaggerItem key={it.title}>
          <div className="group h-full rounded-2xl border border-border/60 bg-card/60 p-6 transition-colors hover:border-primary/40">
            {it.icon && (
              <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:-rotate-6">
                {it.icon}
              </div>
            )}
            <h3 className="mt-4 text-base font-semibold tracking-tight">{it.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function PillarList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((p) => (
        <li key={p} className="flex items-start gap-3 text-sm">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
            <IconCheck size={12} />
          </span>
          <span className="text-foreground/90">{p}</span>
        </li>
      ))}
    </ul>
  );
}

export function MarketingShell({
  children,
  withCta = true,
}: {
  children: React.ReactNode;
  withCta?: boolean;
}) {
  return (
    <div className="relative">
      <div className="relative mx-auto max-w-6xl px-6 pb-24">{children}</div>
      {withCta && <CtaBanner />}
    </div>
  );
}

function CtaBanner() {
  const t = useTranslations("cta");
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden border-t border-border/60 bg-card/30 backdrop-blur-xl"
    >
      <div className="aurora" aria-hidden />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-16 text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight">{t("title")}</h2>
        <p className="max-w-xl text-muted-foreground">{t("subtitle")}</p>
      </div>
    </motion.div>
  );
}
