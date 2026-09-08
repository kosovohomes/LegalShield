"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { IconClipboard, IconCopy, IconSave, IconSparkles } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { saveDocumentRequest } from "@/app/[locale]/cases/[id]/actions";

type CheckCaseRow = {
  id: string;
  title: string;
  jurisdiction: string;
  status: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

type CheckEvidence = {
  original_filename: string;
  category: string | null;
};

type CheckTimeline = {
  event_date: string | null;
  title: string | null;
  description: string | null;
  classification: string | null;
};

type StoredInputs = { summary: string; parties: string; request: string; review: boolean };

function emptyInputs(): StoredInputs {
  return { summary: "", parties: "", request: "", review: false };
}

export function ChecklistPane({
  locale,
  caseRow,
  evidence,
  timeline,
}: {
  locale: string;
  caseRow: CheckCaseRow;
  evidence: CheckEvidence[];
  timeline: CheckTimeline[];
}) {
  const t = useTranslations("case");
  const tc = useTranslations("case.checklist");
  const td = useTranslations("case.draft");
  const router = useRouter();

  const storageKey = `ls-checklist-${caseRow.id}`;
  const [inputs, setInputs] = React.useState<StoredInputs>(emptyInputs);
  const [loaded, setLoaded] = React.useState(false);
  const [draft, setDraft] = React.useState<string | null>(null);
  const [busySave, setBusySave] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setInputs({ ...emptyInputs(), ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, [storageKey]);

  React.useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(inputs));
    } catch {
      /* ignore */
    }
  }, [inputs, loaded, storageKey]);

  const facts = timeline
    .filter((e) => e.classification === "user_fact" || e.classification === "document_observation")
    .slice(0, 30);

  const items = [
    { key: "summary" as const, done: inputs.summary.trim().length >= 2, auto: false, text: true, toggle: false },
    { key: "evidence" as const, done: evidence.length > 0, auto: true, text: false, toggle: false },
    { key: "timeline" as const, done: timeline.length > 0, auto: true, text: false, toggle: false },
    { key: "parties" as const, done: inputs.parties.trim().length >= 2, auto: false, text: true, toggle: false },
    { key: "request" as const, done: inputs.request.trim().length >= 2, auto: false, text: true, toggle: false },
    { key: "review" as const, done: inputs.review, auto: false, text: false, toggle: true },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const allReady = doneCount === items.length;

  function setField<K extends Exclude<keyof StoredInputs, "review">>(key: K, value: string) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function dateFor(loc: string, input?: string | null): string {
    if (!input) return "—";
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(loc === "ar" ? "ar" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function buildDraft(): string {
    const dateLine = dateFor(locale);
    const factsLines = facts.map((e) => `- ${dateFor(locale, e.event_date)}: ${e.title ?? ""}${e.description ? ` — ${e.description}` : ""}`);
    const docLines = evidence.map((e) => {
      const label = e.category ? (t.has(`evidence.categories.${e.category}`) ? t(`evidence.categories.${e.category}`) : e.category) : "";
      return `- ${e.original_filename}${label ? ` (${label})` : ""}`;
    });
    const factsBlock = factsLines.length > 0 ? factsLines.join("\n") : td("noFactsNote");

    return [
      td("title").toUpperCase(),
      `${td("preparedBy")} · ${dateLine} · ${td("statusDraft")}`,
      "",
      `${td("sectionTo")}: ${inputs.parties}`,
      "",
      tc("items.summary.title").toUpperCase(),
      inputs.summary,
      "",
      td("sectionFacts").toUpperCase(),
      factsBlock,
      "",
      td("sectionDocs").toUpperCase(),
      docLines.length > 0 ? docLines.join("\n") : "—",
      "",
      td("sectionAsk").toUpperCase(),
      inputs.request,
      "",
      "---",
      td("disclaimer"),
      "",
      `Case: ${caseRow.title} (${caseRow.jurisdiction})`,
      td("templateNote", { date: dateLine }),
    ].join("\n");
  }

  function generate() {
    setDraft(buildDraft());
  }

  async function copyDraft() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      toast.success(td("copied"));
    } catch {
      toast.error(t("requests.errorGeneric"));
    }
  }

  async function save() {
    if (!draft) return;
    setBusySave(true);
    const fd = new FormData();
    fd.set("summary", inputs.summary);
    fd.set("requestedItems", inputs.request);
    fd.set("generatedText", draft);
    const res = await saveDocumentRequest(caseRow.id, fd);
    setBusySave(false);
    if (res.ok) {
      toast.success(t("requests.saved"));
      router.refresh();
    } else {
      toast.error(res.error === "auth" ? t("requests.errorAuth") : t("requests.errorGeneric"));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">{tc("title")}</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{tc("subtitle")}</p>
          </div>
          <Badge tone={allReady ? "verified" : "observation"} className="shrink-0">
            {allReady ? tc("allReady") : tc("progress", { done: doneCount, total: items.length })}
          </Badge>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted/60">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(doneCount / items.length) * 100}%` }}
          />
        </div>

        <ul className="mt-5 flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.key} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
              <span
                className={cn(
                  "mt-3 grid size-6 shrink-0 place-items-center rounded-full border sm:mt-4",
                  item.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 text-transparent",
                )}
              >
                <IconClipboard size={10} />
              </span>
              <div
                className={cn(
                  "min-w-0 flex-1 rounded-xl border p-3 sm:mt-0.5",
                  item.done ? "border-primary/30 bg-primary/5" : "border-border/60 bg-card/40",
                )}
              >
                <div className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
                  {tc(`items.${item.key}.title`)}
                  {item.auto && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {item.key === "evidence"
                        ? tc("items.evidence.done", { count: evidence.length })
                        : tc("items.timeline.done", { count: timeline.length })}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{tc(`items.${item.key}.hint`)}</div>

                {item.text && (
                  <textarea
                    value={inputs[item.key === "summary" ? "summary" : item.key === "parties" ? "parties" : "request"]}
                    onChange={(e) => setField(item.key === "summary" ? "summary" : item.key === "parties" ? "parties" : "request", e.target.value)}
                    placeholder={tc(`items.${item.key}.placeholder`)}
                    rows={2}
                    className="mt-2 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  />
                )}

                {item.toggle && (
                  <button
                    type="button"
                    onClick={() => setInputs((prev) => ({ ...prev, review: !prev.review }))}
                    className={cn(
                      "mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      item.done
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-4 place-items-center rounded-full border",
                        item.done ? "border-primary bg-primary text-primary-foreground" : "border-border/60",
                      )}
                    >
                      <IconClipboard size={8} />
                    </span>
                    {item.done ? tc("items.review.title") : tc("items.review.title")}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <Button size="sm" className="gap-1.5" disabled={!allReady || draft !== null} onClick={generate}>
            <IconSparkles size={13} />
            {tc("generate")}
          </Button>
        </div>
      </Card>

      {draft !== null && (
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <IconClipboard size={14} />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{td("title")}</h3>
                <p className="text-xs text-muted-foreground">{td("subtitle")}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={copyDraft}>
                <IconCopy size={12} />
                {td("copy")}
              </Button>
              <Button size="sm" className="gap-1.5" disabled={busySave} onClick={save}>
                <IconSave size={12} />
                {busySave ? td("saving") : td("save")}
              </Button>
            </div>
          </div>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={24}
            dir={locale === "ar" ? "rtl" : "ltr"}
            className="mt-4 w-full rounded-xl border border-input bg-background/60 px-4 py-3 font-mono text-[13px] leading-relaxed shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />

          <Disclaimer tone="info" className="mt-4">
            {td("disclaimer")}
          </Disclaimer>
        </Card>
      )}
    </div>
  );
}