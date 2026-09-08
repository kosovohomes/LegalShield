"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { IconShield, IconDownload } from "@/components/ui/icons";
import { formatDate, formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";

export type ReportRow = {
  id: string;
  title: string;
  jurisdiction: string;
  status: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type ReportEvidence = {
  id: string;
  original_filename: string;
  mime_type: string | null;
  file_size_bytes: number | null;
  sha256_hash: string | null;
  category: string | null;
  document_date: string | null;
  created_at: string;
};

export type ReportTimeline = {
  id: string;
  event_date: string | null;
  title: string;
  description: string | null;
  classification: string | null;
  created_at: string | null;
  source_evidence_id?: string | null;
};

export type ReportExpense = {
  id: string;
  expense_date: string | null;
  amount: number | null;
  currency: string | null;
  claimed_purpose: string | null;
  status: string | null;
  payee: string | null;
  created_at: string;
};

export function CaseReport({
  locale,
  caseId,
  caseRow,
  evidence,
  timeline,
  expenses,
  requests,
}: {
  locale: string;
  caseId: string;
  caseRow: ReportRow;
  evidence: ReportEvidence[];
  timeline: ReportTimeline[];
  expenses: ReportExpense[];
  requests: any[];
}) {
  const t = useTranslations("case.report");
  const md = `font-mono text-[10px] break-all text-foreground/70`;

  const header = (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
      <div className="flex items-center gap-2 font-semibold">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          <IconShield size={16} />
        </span>
        <span className="text-base">LegalShield</span>
      </div>
      <div className="text-right">
        <div className="text-xs text-muted-foreground">{t("generatedAt", { date: formatDate(new Date().toISOString(), locale) })}</div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="no-print sticky top-0 z-10 -mx-2 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 backdrop-blur-xl print:hidden">
        <div className="text-sm">
          <Link href={`/${locale}/cases/${caseId}`} className="text-muted-foreground hover:text-foreground">
            ← {t("back")}
          </Link>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => window.print()}>
          <IconDownload size={14} />
          {t("print")}
        </Button>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/40 px-6 py-8 sm:px-12">
        {header}

        <div className="mt-6">
          <h1 className="text-2xl font-semibold tracking-tight">{caseRow.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("sections.caseSummary")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            {caseRow.description ?? "—"}
          </p>
        </section>

        <section className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
          {[
            [t("field.jurisdiction"), caseRow.jurisdiction],
            [t("field.status"), caseRow.status],
            [t("field.createdOn"), formatDate(caseRow.created_at, locale)],
            [t("field.updatedOn"), formatDate(caseRow.updated_at, locale)],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{k}</div>
              <div className="mt-0.5 text-sm font-medium">{v}</div>
            </div>
          ))}
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("sections.timeline")}
          </h2>
          {timeline.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">{t("empty.timeline")}</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {timeline.slice(0, 60).map((ev) => (
                <li key={ev.id} className="border-l-2 border-border pl-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="text-sm font-semibold">{ev.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(ev.event_date ?? ev.created_at, locale)}
                    </div>
                  </div>
                  {ev.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{ev.description}</p>
                  )}
                  {ev.classification && (
                    <div className="mt-1 text-[10px] uppercase tracking-wide text-foreground/50">
                      {ev.classification.replace(/_/g, " ")}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("sections.evidence")}
          </h2>
          {evidence.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">{t("empty.evidence")}</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">{t("field.filename")}</th>
                    <th className="py-2 pr-4 font-medium">{t("field.category")}</th>
                    <th className="py-2 pr-4 font-medium">{t("field.date")}</th>
                    <th className="py-2 pr-4 font-medium">{t("field.size")}</th>
                    <th className="py-2 font-medium">{t("field.sha256")}</th>
                  </tr>
                </thead>
                <tbody>
                  {evidence.map((e) => (
                    <tr key={e.id} className="border-b border-border/60 align-top">
                      <td className="py-2 pr-4 font-medium">{e.original_filename}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{e.category ?? "—"}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{formatDate(e.document_date ?? e.created_at, locale)}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{formatBytes(e.file_size_bytes)}</td>
                      <td className={cn("py-2", md)} dir="ltr">{e.sha256_hash ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("sections.expenses")}
          </h2>
          {expenses.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">{t("empty.expenses")}</p>
          ) : (
            <table className="mt-3 w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">{t("field.date")}</th>
                  <th className="py-2 pr-4 font-medium">{t("field.amount")}</th>
                  <th className="py-2 pr-4 font-medium">{t("field.claim")}</th>
                  <th className="py-2 pr-4 font-medium">{t("field.payee")}</th>
                  <th className="py-2 font-medium">{t("field.status")}</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((x) => (
                  <tr key={x.id} className="border-b border-border/60 align-top">
                    <td className="py-2 pr-4">{formatDate(x.expense_date, locale)}</td>
                    <td className="py-2 pr-4 font-medium">
                      {x.amount != null ? `${Number(x.amount).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} ${x.currency ?? ""}` : "—"}
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">{x.claimed_purpose ?? "—"}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{x.payee ?? "—"}</td>
                    <td className="py-2 text-muted-foreground">{x.status ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <div className="mt-10 rounded-xl border border-border/70 bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
          {t("disclaimer")}
        </div>
      </div>
    </div>
  );
}