"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  IconFile,
  IconClock,
  IconSend,
  IconPlus,
  IconUpload,
  IconAlert,
  IconArrowRight,
  IconSparkles,
  IconBook,
} from "@/components/ui/icons";
import { Stagger, StaggerItem, FadeIn } from "@/components/motion-primitives";
import { formatRelative } from "@/lib/format";
import { Disclaimer } from "@/components/ui/disclaimer";
import type { Jurisdiction } from "@/lib/constants";

type CaseRow = {
  id: string;
  title: string;
  jurisdiction: string;
  status: string;
  updated_at: string;
  created_at: string;
};

export function DashboardClient({
  locale,
  email,
  fullName,
  cases,
  evidenceCount,
  requestCount,
  defaultJurisdiction,
}: {
  locale: string;
  email: string;
  fullName: string | null;
  cases: CaseRow[];
  evidenceCount: number;
  requestCount: number;
  defaultJurisdiction: Jurisdiction | null;
}) {
  const t = useTranslations("dashboard");
  const greeting = greetingFor();

  return (
    <div className="flex flex-col gap-8">
      <FadeIn>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {greeting}{fullName ? `, ${fullName}` : ""}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t("title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Button asChild className="gap-1.5">
            <Link href={`/${locale}/cases/new`}>
              <IconPlus size={14} />
              {t("actionsList.newCase")}
            </Link>
          </Button>
        </div>
      </FadeIn>

      <Stagger className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StaggerItem>
          <StatCard
            label={t("stats.cases")}
            value={cases.length}
            icon={<IconFile size={14} />}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label={t("stats.evidence")}
            value={evidenceCount}
            icon={<IconUpload size={14} />}
            trend="encrypted"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label={t("stats.pending")}
            value={requestCount}
            icon={<IconSend size={14} />}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label={t("stats.toVerify")}
            value={0}
            icon={<IconAlert size={14} />}
            trend="default"
          />
        </StaggerItem>
      </Stagger>

      <Disclaimer tone="info">
        {t("empty.body") ? "" : ""}
        <strong className="text-foreground">{t("empty.title")}.</strong> {t("empty.body")}
      </Disclaimer>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              {t("recent")}
            </h2>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
              <Link href={`/${locale}/cases`}>
                {t("nav.back", { defaultMessage: "All" } as any)}
                <IconArrowRight size={12} className="rtl:rotate-180" />
              </Link>
            </Button>
          </div>
          {cases.length === 0 ? (
            <EmptyCases locale={locale} />
          ) : (
            <Stagger className="flex flex-col gap-2">
              {cases.slice(0, 6).map((c) => (
                <StaggerItem key={c.id}>
                  <Link
                    href={`/${locale}/cases/${c.id}`}
                    className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 p-4 transition-colors hover:border-primary/40 hover:bg-card"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge tone="observation" className="uppercase">
                          {c.jurisdiction}
                        </Badge>
                        <span>·</span>
                        <span>{c.status}</span>
                      </div>
                      <div className="mt-1 truncate text-sm font-medium">{c.title}</div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="hidden sm:inline">{formatRelative(c.updated_at, locale)}</span>
                      <IconArrowRight
                        size={14}
                        className="text-muted-foreground transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                      />
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold tracking-tight text-foreground">
            {t("actions")}
          </h2>
          <div className="grid gap-2">
            <ActionCard
              href={`/${locale}/cases/new`}
              icon={<IconPlus size={16} />}
              label={t("actionsList.newCase")}
              hint="Start a new case workspace."
            />
            <ActionCard
              href={cases[0] ? `/${locale}/cases/${cases[0].id}?tab=evidence` : `/${locale}/cases/new`}
              icon={<IconUpload size={16} />}
              label={t("actionsList.upload")}
              hint="Encrypted on your device before upload."
            />
            <ActionCard
              href={cases[0] ? `/${locale}/cases/${cases[0].id}?tab=requests` : `/${locale}/cases/new`}
              icon={<IconSend size={16} />}
              label={t("actionsList.request")}
              hint="A neutral draft from your facts."
            />
            <ActionCard
              href={`/${locale}/rights`}
              icon={<IconBook size={16} />}
              label={t("actionsList.rights")}
              hint="Your rights, attorney duties, draft letters — KW & JO."
            />
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-border/60 bg-card/30 p-4 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <IconSparkles size={14} className="text-primary" />
              <span className="font-medium">AI observation policy</span>
            </div>
            <p className="mt-2 text-muted-foreground">
              {t("disclaimers.aiAnalysis", { defaultMessage: "" } as any) || ""}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Default jurisdiction: {defaultJurisdiction ?? "—"}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function EmptyCases({ locale }: { locale: string }) {
  const t = useTranslations("dashboard");
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-8 text-center"
    >
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
        <IconFile size={20} />
      </div>
      <h3 className="mt-4 text-base font-semibold">{t("empty.title")}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        {t("empty.body")}
      </p>
      <Button asChild size="sm" className="mt-4 gap-1.5">
        <Link href={`/${locale}/cases/new`}>
          <IconPlus size={14} />
          {t("empty.cta")}
        </Link>
      </Button>
    </motion.div>
  );
}

function ActionCard({
  href,
  icon,
  label,
  hint,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 p-4 transition-colors hover:border-primary/40 hover:bg-card"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          {icon}
        </span>
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="truncate text-xs text-muted-foreground">{hint}</div>
        </div>
      </div>
      <IconArrowRight
        size={14}
        className="text-muted-foreground transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
      />
    </Link>
  );
}

function greetingFor() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
