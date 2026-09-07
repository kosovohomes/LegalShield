"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Field, Input } from "@/components/ui/field";
import {
  IconFile,
  IconPlus,
  IconSearch,
  IconArrowRight,
} from "@/components/ui/icons";
import { Stagger, StaggerItem } from "@/components/motion-primitives";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

type CaseRow = {
  id: string;
  title: string;
  jurisdiction: string;
  status: string;
  description: string | null;
  updated_at: string;
  created_at: string;
};

const STATUS_TONE: Record<string, "observation" | "verified" | "warning" | "ai" | "neutral"> = {
  active: "observation",
  monitoring: "ai",
  resolved: "verified",
  closed: "neutral",
  archived: "neutral",
};

export function CasesListClient({ locale, cases }: { locale: string; cases: CaseRow[] }) {
  const t = useTranslations("casesList");
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState<string>("all");

  const filtered = cases.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (q && !`${c.title} ${c.description ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const statusFilters = ["all", "active", "monitoring", "resolved", "closed", "archived"] as const;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button asChild className="gap-1.5">
          <Link href={`/${locale}/cases/new`}>
            <IconPlus size={14} />
            {t("new")}
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <IconSearch
            size={14}
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search")}
            className="ps-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors",
                filter === s
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t(`filter.${s}`)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState locale={locale} />
      ) : (
        <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <StaggerItem key={c.id}>
              <Link
                href={`/${locale}/cases/${c.id}`}
                className="group block h-full"
              >
                <Card className="flex h-full flex-col p-5 transition-colors group-hover:border-primary/40">
                  <div className="flex items-center justify-between">
                    <Badge tone="observation">{c.jurisdiction}</Badge>
                    <Badge tone={STATUS_TONE[c.status] ?? "neutral"}>
                      {t(`filter.${c.status}` as any, { defaultMessage: c.status } as any)}
                    </Badge>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-sm font-semibold tracking-tight">
                    {c.title}
                  </h3>
                  {c.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                      {c.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <IconFile size={12} />
                      {formatRelative(c.updated_at, locale)}
                    </span>
                    <IconArrowRight
                      size={14}
                      className="text-muted-foreground transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                    />
                  </div>
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}

function EmptyState({ locale }: { locale: string }) {
  const t = useTranslations("casesList");
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-12 text-center"
    >
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
        <IconFile size={20} />
      </div>
      <h3 className="mt-4 text-base font-semibold">{t("empty.title")}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{t("empty.body")}</p>
      <Button asChild size="sm" className="mt-4 gap-1.5">
        <Link href={`/${locale}/cases/new`}>
          <IconPlus size={14} />
          {t("empty.cta")}
        </Link>
      </Button>
    </motion.div>
  );
}
