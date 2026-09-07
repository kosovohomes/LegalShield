"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { Stagger, StaggerItem } from "@/components/motion-primitives";
import {
  IconFile,
  IconClock,
  IconWallet,
  IconSend,
  IconCompass,
  IconBook,
  IconDownload,
  IconUpload,
  IconPlus,
  IconCheck,
  IconLock,
  IconAlert,
} from "@/components/ui/icons";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

type CaseRow = {
  id: string;
  title: string;
  jurisdiction: string;
  status: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

const TABS = [
  { key: "overview", icon: IconBook },
  { key: "evidence", icon: IconFile },
  { key: "timeline", icon: IconClock },
  { key: "expenses", icon: IconWallet },
  { key: "requests", icon: IconSend },
  { key: "verification", icon: IconCompass },
  { key: "export", icon: IconDownload },
] as const;

export function CaseWorkspace({
  locale,
  activeTab,
  caseRow,
  evidence,
  timeline,
  expenses,
  requests,
  categories,
}: {
  locale: string;
  activeTab: string;
  caseRow: CaseRow;
  evidence: any[];
  timeline: any[];
  expenses: any[];
  requests: any[];
  categories: readonly string[];
}) {
  const t = useTranslations("case");
  const router = useRouter();

  function setTab(k: string) {
    router.replace(`/${locale}/cases/${caseRow.id}?tab=${k}`, { scroll: false });
  }

  const stats = {
    evidence: evidence.length,
    timeline: timeline.length,
    expenses: expenses.length,
    pending: requests.filter((r) => r.status === "draft" || r.status === "sent").length,
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge tone="observation">{caseRow.jurisdiction}</Badge>
          <span>·</span>
          <span className="capitalize">{caseRow.status}</span>
          <span>·</span>
          <span>
            {t("updatedOn", { date: formatRelative(caseRow.updated_at, locale) })}
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{caseRow.title}</h1>
        {caseRow.description && (
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{caseRow.description}</p>
        )}
      </header>

      <Stagger className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StaggerItem>
          <StatCard label="Evidence" value={stats.evidence} icon={<IconFile size={14} />} />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Timeline" value={stats.timeline} icon={<IconClock size={14} />} />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Expenses" value={stats.expenses} icon={<IconWallet size={14} />} />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Pending" value={stats.pending} icon={<IconSend size={14} />} />
        </StaggerItem>
      </Stagger>

      <nav className="sticky top-16 z-20 -mx-4 flex gap-1 overflow-x-auto border-b border-border/60 bg-background/60 px-4 py-2 backdrop-blur-xl sm:mx-0 sm:px-0">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setTab(tab.key)}
              className={cn(
                "relative flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon size={14} className={active ? "text-primary" : ""} />
              {t(`tabs.${tab.key}`)}
              {active && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute inset-x-2 -bottom-2 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab === "overview" && (
            <OverviewPane caseRow={caseRow} stats={stats} evidence={evidence} />
          )}
          {activeTab === "evidence" && (
            <EvidencePane locale={locale} items={evidence} categories={categories} />
          )}
          {activeTab === "timeline" && <TimelinePane items={timeline} />}
          {activeTab === "expenses" && <ExpensesPane items={expenses} />}
          {activeTab === "requests" && <RequestsPane items={requests} />}
          {activeTab === "verification" && <VerificationPane />}
          {activeTab === "export" && <ExportPane />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OverviewPane({ caseRow, stats, evidence }: { caseRow: CaseRow; stats: any; evidence: any[] }) {
  const t = useTranslations("case");
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2 p-6">
        <h2 className="text-sm font-semibold tracking-tight">{t("overview.summary")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {caseRow.description ?? t("noDescription")}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Evidence", value: stats.evidence, tone: "observation" as const },
            { label: "Timeline", value: stats.timeline, tone: "verified" as const },
            { label: "Expenses", value: stats.expenses, tone: "ai" as const },
            { label: "Pending", value: stats.pending, tone: "warning" as const },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-border/60 bg-card/60 p-4"
            >
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {c.label}
              </div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">{c.value}</div>
            </div>
          ))}
        </div>
        {evidence.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Latest evidence
            </h3>
            <ul className="mt-2 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/40">
              {evidence.slice(0, 3).map((e) => (
                <li key={e.id} className="flex items-center justify-between p-3 text-sm">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                      <IconFile size={14} />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{e.original_filename}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {e.category} · {(e.file_size_bytes / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge tone="verified">
                      <IconLock size={10} />
                      {e.encryption_version ?? "v1"}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
      <Card className="p-6">
        <h2 className="text-sm font-semibold tracking-tight">{t("overview.meta")}</h2>
        <dl className="mt-3 space-y-3 text-sm">
          {[
            ["Jurisdiction", caseRow.jurisdiction],
            ["Status", caseRow.status],
            ["Created", new Date(caseRow.created_at).toLocaleDateString()],
            ["Updated", new Date(caseRow.updated_at).toLocaleString()],
          ].map(([k, v]) => (
            <div key={k as string} className="flex items-center justify-between">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <Disclaimer tone="info" className="mt-4">
          AI observations on this case will appear labeled here. They are observations, not verdicts.
        </Disclaimer>
      </Card>
    </div>
  );
}

function EvidencePane({
  locale,
  items,
  categories,
}: {
  locale: string;
  items: any[];
  categories: readonly string[];
}) {
  const t = useTranslations("case");
  const [drag, setDrag] = React.useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
        }}
        className={cn(
          "rounded-2xl border-2 border-dashed bg-card/40 p-10 text-center transition-colors",
          drag ? "border-primary bg-primary/5" : "border-border/60",
        )}
      >
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <IconUpload size={20} />
        </div>
        <h3 className="mt-4 text-base font-semibold">{t("evidence.drop")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("evidence.or")}{" "}
          <button className="text-primary underline-offset-4 hover:underline">
            {t("evidence.browse")}
          </button>
        </p>
        <Disclaimer tone="info" className="mt-4 text-start">
          Files are hashed (SHA-256), encrypted with AES-256-GCM on your device, and uploaded. Originals are never modified.
        </Disclaimer>
      </div>

      {items.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          {t("evidence.empty")}
        </Card>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {items.map((e) => (
            <li key={e.id}>
              <Card className="flex items-center justify-between p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <IconFile size={14} />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{e.original_filename}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {e.category} · {e.mime_type ?? "—"} · {(e.file_size_bytes / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge tone="verified">
                    <IconCheck size={10} />
                    {t("evidence.hashed")}
                  </Badge>
                  <Badge tone="observation">
                    <IconLock size={10} />
                    {t("evidence.encrypted")}
                  </Badge>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TimelinePane({ items }: { items: any[] }) {
  const t = useTranslations("case");
  if (items.length === 0) {
    return (
      <Card className="p-10 text-center text-sm text-muted-foreground">
        {t("timeline.empty")}
      </Card>
    );
  }
  return (
    <ol className="relative space-y-3 border-s border-border/60 ps-6">
      {items.map((e) => (
        <li key={e.id} className="relative">
          <span className="absolute -start-[31px] top-2 grid size-3.5 place-items-center rounded-full bg-card ring-2 ring-primary/30">
            <span className="size-1.5 rounded-full bg-primary" />
          </span>
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge tone={toneFor(e.classification)}>{e.classification}</Badge>
              <span>{e.event_date ? new Date(e.event_date).toLocaleDateString() : "—"}</span>
            </div>
            <div className="mt-2 text-sm font-medium">{e.title}</div>
            {e.description && (
              <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>
            )}
          </Card>
        </li>
      ))}
    </ol>
  );
}

function ExpensesPane({ items }: { items: any[] }) {
  const t = useTranslations("case");
  if (items.length === 0) {
    return (
      <Card className="p-10 text-center text-sm text-muted-foreground">
        {t("expenses.empty")}
      </Card>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/40">
      <table className="w-full text-sm">
        <thead className="bg-muted/30 text-start text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-start font-medium">Date</th>
            <th className="px-4 py-3 text-start font-medium">Purpose</th>
            <th className="px-4 py-3 text-start font-medium">Payee</th>
            <th className="px-4 py-3 text-end font-medium">Amount</th>
            <th className="px-4 py-3 text-start font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {items.map((e) => (
            <tr key={e.id} className="hover:bg-card/60">
              <td className="px-4 py-3 text-muted-foreground">
                {e.expense_date ?? "—"}
              </td>
              <td className="px-4 py-3 font-medium">{e.claimed_purpose ?? "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{e.payee ?? "—"}</td>
              <td className="px-4 py-3 text-end tabular-nums">
                {e.amount?.toFixed?.(2) ?? e.amount} {e.currency}
              </td>
              <td className="px-4 py-3">
                <Badge tone={expenseTone(e.status)}>{e.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RequestsPane({ items }: { items: any[] }) {
  const t = useTranslations("case");
  if (items.length === 0) {
    return (
      <Card className="p-10 text-center text-sm text-muted-foreground">
        {t("requests.empty")}
      </Card>
    );
  }
  return (
    <ul className="grid gap-2">
      {items.map((r) => (
        <li key={r.id}>
          <Card className="flex items-center justify-between p-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {r.request_type}
              </div>
              <div className="text-sm font-medium">{r.factual_summary ?? "—"}</div>
            </div>
            <Badge tone="observation">{r.status}</Badge>
          </Card>
        </li>
      ))}
    </ul>
  );
}

function VerificationPane() {
  const t = useTranslations("case");
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {[
        { j: "KW", a: "Ministry of Justice", title: "Case status lookup" },
        { j: "KW", a: "Court of First Instance", title: "Hearing schedule" },
        { j: "JO", a: "Ministry of Justice", title: "Case status lookup" },
        { j: "JO", a: "Magistrate courts", title: "Filing receipts" },
      ].map((g, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge tone="observation">{g.j}</Badge>
            <span>{g.a}</span>
          </div>
          <div className="mt-2 text-sm font-medium">{g.title}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Source and last-verified date will appear here once the legal team publishes a guide.
          </p>
          <Button variant="outline" size="sm" className="mt-3 gap-1">
            <IconCompass size={12} />
            Open guide
          </Button>
        </Card>
      ))}
    </div>
  );
}

function ExportPane() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {[
        { title: "Human-readable PDF", body: "Case summary, timeline, evidence index, expense summary.", icon: IconBook },
        { title: "Evidence archive (ZIP)", body: "Originals + manifest with hashes for integrity.", icon: IconDownload },
        { title: "Lawyer review package", body: "Everything an independent lawyer needs in one bundle.", icon: IconSend },
      ].map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.title} className="p-5">
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Icon size={16} />
            </div>
            <h3 className="mt-3 text-sm font-semibold">{c.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
            <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5">
              <IconDownload size={12} />
              Generate
            </Button>
          </Card>
        );
      })}
    </div>
  );
}

function toneFor(c: string): "verified" | "warning" | "observation" | "ai" | "professional" | "neutral" {
  switch (c) {
    case "user_fact":
      return "verified";
    case "user_allegation":
      return "warning";
    case "document_observation":
    case "system_extraction":
      return "observation";
    case "ai_observation":
      return "ai";
    case "professional_opinion":
      return "professional";
    default:
      return "neutral";
  }
}

function expenseTone(s: string): "verified" | "warning" | "conflict" | "observation" | "neutral" {
  switch (s) {
    case "document_supported":
    case "payment_supported":
    case "user_confirmed":
      return "verified";
    case "conflicting":
      return "conflict";
    case "professional_review_required":
      return "warning";
    case "unverified":
      return "observation";
    default:
      return "neutral";
  }
}
