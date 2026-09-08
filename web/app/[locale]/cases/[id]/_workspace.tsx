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
  IconPlus,
  IconCheck,
  IconLock,
  IconAlert,
} from "@/components/ui/icons";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EvidenceUpload } from "@/components/evidence-upload";
import { toast } from "sonner";
import { addTimelineEvent } from "./actions";
import { buildArchive, downloadArchive } from "@/lib/export/archive";

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
  caseId,
  caseRow,
  evidence,
  timeline,
  expenses,
  requests,
  categories,
}: {
  locale: string;
  activeTab: string;
  caseId: string;
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
            <EvidencePane locale={locale} caseId={caseId} items={evidence} categories={categories} />
          )}
          {activeTab === "timeline" && <TimelinePane caseId={caseId} items={timeline} />}
          {activeTab === "expenses" && <ExpensesPane items={expenses} />}
          {activeTab === "requests" && <RequestsPane items={requests} />}
          {activeTab === "verification" && <VerificationPane />}
          {activeTab === "export" && (
            <ExportPane locale={locale} caseRow={caseRow} evidence={evidence} />
          )}
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
  caseId,
  items,
  categories,
}: {
  locale: string;
  caseId: string;
  items: any[];
  categories: readonly string[];
}) {
  const t = useTranslations("case");
  return (
    <div className="flex flex-col gap-4">
      <EvidenceUpload caseId={caseId} categories={categories} />

      <Disclaimer tone="info" className="text-start">
        {t("evidence.securityNote")}
      </Disclaimer>

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
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <IconFile size={14} />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{e.original_filename}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {t(`evidence.categories.${e.category}`)}
                      {e.document_date ? ` · ${new Date(e.document_date).toLocaleDateString()}` : ""}
                      {" · "}
                      {(e.file_size_bytes / 1024).toFixed(1)} KB
                    </div>
                    {e.description && (
                      <div className="mt-0.5 truncate text-xs text-muted-foreground/70">
                        {e.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                  <Badge tone="verified" title={e.sha256_hash}>
                    <IconCheck size={10} />
                    {t("evidence.hashed")}
                  </Badge>
                  {e.downloadable !== false && (
                    <a
                      href={`/api/evidence/${e.id}/download`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/60 px-2.5 py-0.5 text-[11px] font-medium text-foreground ring-1 ring-inset ring-border/60 transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <IconDownload size={10} />
                      {t("evidence.download")}
                    </a>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TimelinePane({ caseId, items }: { caseId: string; items: any[] }) {
  const t = useTranslations("case");
  return (
    <div className="flex flex-col gap-4">
      <TimelineAddForm caseId={caseId} />
      {items.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          {t("timeline.empty")}
        </Card>
      ) : (
        <ol className="relative space-y-3 border-s border-border/60 ps-6">
          {items.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute -start-[31px] top-2 grid size-3.5 place-items-center rounded-full bg-card ring-2 ring-primary/30">
                <span className="size-1.5 rounded-full bg-primary" />
              </span>
              <Card className="p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge tone={toneFor(e.classification)}>
                    {t(`timeline.classifications.${e.classification}`)}
                  </Badge>
                  <span>
                    {e.event_date ? new Date(e.event_date).toLocaleDateString() : "—"}
                  </span>
                  {e.source_evidence_id && (
                    <a
                      href={`/api/evidence/${e.source_evidence_id}/download`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                    >
                      <IconDownload size={10} />
                      {t("timeline.evidenceSource")}
                    </a>
                  )}
                </div>
                <div className="mt-2 text-sm font-medium">{e.title}</div>
                {e.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>
                )}
              </Card>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function TimelineAddForm({ caseId }: { caseId: string }) {
  const t = useTranslations("case");
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [classification, setClassification] = React.useState("user_fact");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [eventDate, setEventDate] = React.useState("");

  async function submit() {
    if (title.trim().length < 2) return;
    setBusy(true);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("description", description);
    fd.set("eventDate", eventDate);
    fd.set("classification", classification);
    const res = await addTimelineEvent(caseId, fd);
    setBusy(false);
    if (res.ok) {
      toast.success(t("timeline.added"));
      setTitle("");
      setDescription("");
      setEventDate("");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(res.error === "auth" ? t("timeline.errorAuth") : t("timeline.errorGeneric"));
    }
  }

  return (
    <Card className="p-4">
      {!open ? (
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
          <IconPlus size={14} />
          {t("timeline.add")}
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium">{t("timeline.addTitle")}</div>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("timeline.titlePlaceholder")}
            maxLength={300}
            className="h-10 w-full rounded-xl border border-input bg-background/60 px-3.5 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("timeline.descriptionPlaceholder")}
            maxLength={2000}
            rows={2}
            className="min-h-[64px] w-full rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background/60 px-3.5 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
            <div className="flex flex-wrap gap-2">
              {["user_fact", "user_allegation"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setClassification(c)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    classification === c
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-primary/40",
                  )}
                >
                  {t(`timeline.nature.${c}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              {t("timeline.cancel")}
            </Button>
            <Button size="sm" onClick={submit} disabled={busy || title.trim().length < 2} className="gap-1.5">
              <IconPlus size={14} />
              {busy ? t("timeline.adding") : t("timeline.submit")}
            </Button>
          </div>
        </div>
      )}
    </Card>
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

function ExportPane({
  locale,
  caseRow,
  evidence,
}: {
  locale: string;
  caseRow: CaseRow;
  evidence: any[];
}) {
  const t = useTranslations("case.export");
  const [busy, setBusy] = React.useState<"zip" | "review" | null>(null);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);

  async function runArchive(kind: "zip" | "review") {
    if (evidence.length === 0) {
      toast.error(t("zipEmpty"));
      return;
    }
    setBusy(kind);
    setProgress(null);
    try {
      const result = await buildArchive({
        caseRow,
        evidence,
        kind: kind === "review" ? "lawyer" : "evidence",
        locale,
        onProgress: (done, total) => setProgress({ done, total }),
        onSkipped: (name) => toast.info(t("zipMissing", { name })),
      });
      downloadArchive(result);
      toast.success(t("zipDone"));
    } catch {
      toast.error(t("zipFailed"));
    } finally {
      setBusy(null);
      setProgress(null);
    }
  }

  const cards = [
    {
      key: "pdf",
      title: t("pdf"),
      body: t("pdfDesc"),
      hint: t("pdfHint"),
      icon: IconBook,
      action: (
        <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5" asChild>
          <Link href={`/${locale}/cases/${caseRow.id}/report`} target="_blank">
            <IconBook size={12} />
            {t("pdfOpen")}
          </Link>
        </Button>
      ),
    },
    {
      key: "zip",
      title: t("zip"),
      body: t("zipDesc"),
      hint: `${evidence.length} files`,
      icon: IconDownload,
      action: (
        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full gap-1.5"
          disabled={busy !== null || evidence.length === 0}
          onClick={() => runArchive("zip")}
        >
          <IconDownload size={12} />
          {busy === "zip" && progress ? t("zipProgress", { done: progress.done, total: progress.total }) : busy === "zip" ? t("downloading") : t("zipGenerate")}
        </Button>
      ),
    },
    {
      key: "review",
      title: t("review"),
      body: t("reviewDesc"),
      hint: t("reviewHint"),
      icon: IconSend,
      action: (
        <Button
          variant="default"
          size="sm"
          className="mt-4 w-full gap-1.5"
          disabled={busy !== null || evidence.length === 0}
          onClick={() => runArchive("review")}
        >
          <IconSend size={12} />
          {busy === "review" && progress ? t("zipProgress", { done: progress.done, total: progress.total }) : busy === "review" ? t("downloading") : t("zipGenerate")}
        </Button>
      ),
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.key} className="p-5">
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Icon size={16} />
            </div>
            <h3 className="mt-3 text-sm font-semibold">{c.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
            <p className="mt-1.5 text-xs text-foreground/50">{c.hint}</p>
            {c.action}
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
