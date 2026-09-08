"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { FadeIn } from "@/components/motion-primitives";
import {
  IconShield,
  IconBriefcase,
  IconAlert,
  IconFile,
  IconScale,
  IconSend,
  IconBook,
  IconCompass,
  IconCheck,
  IconX,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { CountryCode, JurisdictionRights, Localized } from "@/lib/rights";

const SECTION_META: { id: SectionKey; icon: React.ReactNode }[] = [
  { id: "rights", icon: <IconShield size={14} /> },
  { id: "duties", icon: <IconBriefcase size={14} /> },
  { id: "courses", icon: <IconAlert size={14} /> },
  { id: "evidence", icon: <IconFile size={14} /> },
  { id: "actions", icon: <IconScale size={14} /> },
  { id: "templates", icon: <IconSend size={14} /> },
  { id: "resources", icon: <IconBook size={14} /> },
  { id: "disclaimer", icon: <IconCompass size={14} /> },
];

type SectionKey =
  | "rights"
  | "duties"
  | "courses"
  | "evidence"
  | "actions"
  | "templates"
  | "resources"
  | "disclaimer";

export function RightsHub({
  data,
  defaultCountry = "KW",
}: {
  data: JurisdictionRights[];
  defaultCountry?: CountryCode;
}) {
  const locale = useLocale();
  const t = useTranslations("rights");
  const [country, setCountry] = React.useState<CountryCode>(defaultCountry);
  const d = data.find((x) => x.country === country) ?? data[0];
  const pl = (x: Localized) => (locale === "ar" ? x.ar : x.en);

  return (
    <div className="flex flex-col gap-16">
      <FadeIn>
        <CountryToggle
          countries={data}
          active={d.country}
          onSelect={setCountry}
          tLabel={t("nav")}
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{t("snapshot")}</Badge>
          <Badge tone="neutral">{pl(d.updated)}</Badge>
          <Badge tone="neutral">{pl(d.basis)}</Badge>
        </div>
      </FadeIn>

      <FadeIn>
        <Toc meta={SECTION_META} />
      </FadeIn>

      <section id="rights" className="scroll-mt-24">
        <SectionHeading icon={<IconShield size={16} />} title={t("sections.rights")} lead={pl(d.rightsLead)} />
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {d.rights.map((r, i) => (
            <Card key={r.id} className="flex h-full gap-3 p-5">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-semibold text-primary ring-1 ring-primary/20">
                {i + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold tracking-tight">{pl(r.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pl(r.body)}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="duties" className="scroll-mt-24">
        <SectionHeading icon={<IconBriefcase size={16} />} title={t("sections.duties")} lead={pl(d.dutiesLead)} />
        <div className="mt-6 flex flex-col gap-3">
          {d.duties.map((x) => (
            <Card key={x.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <h3 className="text-sm font-semibold tracking-tight">{pl(x.title)}</h3>
                <Badge tone="neutral" className="shrink-0">
                  {t("source")}: {pl(x.standard)}
                </Badge>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pl(x.body)}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="courses" className="scroll-mt-24">
        <SectionHeading icon={<IconAlert size={16} />} title={t("sections.courses")} lead={pl(d.coursesLead)} />
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {([d.courses.misconduct, d.courses.malpractice, d.courses.fiduciary] as const).map((c, i) => (
            <Card key={c.id} className="flex h-full flex-col gap-3 p-5">
              <Badge tone={["warning", "observation", "conflict"][i] as any}>
                {["A", "B", "C"][i]}
              </Badge>
              <div>
                <h3 className="text-sm font-semibold tracking-tight">{pl(c.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pl(c.body)}</p>
              </div>
              <ul className="mt-auto flex flex-col gap-2 pt-2">
                {c.indicators.map((ind) => (
                  <li key={ind.en} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/80">
                    <IconCheck size={13} className="mt-0.5 shrink-0 text-primary" />
                    <span>{pl(ind)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
          <IconAlert size={15} className="mt-0.5 shrink-0 text-primary" />
          <span>{pl(d.parallelLead)}</span>
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {d.parallel.map((p) => (
            <li key={p.en} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <IconCheck size={13} className="mt-1 shrink-0 text-primary" />
              <span>{pl(p)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="evidence" className="scroll-mt-24">
        <SectionHeading icon={<IconFile size={16} />} title={t("sections.evidence")} lead={pl(d.evidenceLead)} />
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {d.evidence.map((e) => (
            <Card key={e.id} className="flex gap-3 p-5">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <IconFile size={14} />
              </span>
              <div>
                <h3 className="text-sm font-semibold tracking-tight">{pl(e.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pl(e.body)}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="actions" className="scroll-mt-24">
        <SectionHeading icon={<IconScale size={16} />} title={t("sections.actions")} lead={pl(d.actionsLead)} />
        <div className="mt-6 flex flex-col gap-3">
          {d.actions.map((a) => (
            <ActionCard key={a.id} action={a} t={pl} lbl={{ bestFor: t("bestFor"), evidence: t("evidenceLabel"), steps: t("stepsLabel"), parallel: t("parallel"), verify: t("verify") }} />
          ))}
        </div>
      </section>

      <section id="templates" className="scroll-mt-24">
        <SectionHeading icon={<IconSend size={16} />} title={t("sections.templates")} lead={pl(d.templatesLead)} />
        <Disclaimer tone="info" className="mt-5">
          {pl(d.templates.note)}
        </Disclaimer>
        <div className="mt-5 flex flex-col gap-4">
          {d.templates.items.map((tmpl) => (
            <TemplateCard key={tmpl.id} tmpl={tmpl} locale={locale} t={pl} labels={{ draft: t("draft"), copy: t("copy"), copied: t("copied"), reset: t("reset") }} />
          ))}
        </div>
      </section>

      <section id="resources" className="scroll-mt-24">
        <SectionHeading icon={<IconBook size={16} />} title={t("sections.resources")} lead={pl(d.resourcesLead)} />
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {d.resources.map((r) => (
            <Card key={r.id} className="flex h-full flex-col gap-3 p-5">
              <div className="flex items-center justify-between gap-2">
                <Badge tone={r.verified ? "verified" : "warning"}>
                  {r.verified ? t("officialBody") : t("verify")}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight">{pl(r.authority)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pl(r.role)}</p>
              </div>
              {r.note && (
                <p className="mt-auto text-xs leading-relaxed text-muted-foreground">{pl(r.note)}</p>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section id="disclaimer" className="scroll-mt-24">
        <div className="flex flex-col gap-4">
          <Disclaimer tone="critical">
            <strong className="text-foreground">{t("notAdviceTitle")}. </strong>
            <span>{t("notAdviceBody")}</span>
          </Disclaimer>
          <Disclaimer tone="warning">{pl(d.verify)}</Disclaimer>
          <div className="flex justify-center pt-2">
            <Button asChild size="lg">
              <Link href={locale ? `/${locale}/login` : "/login"}>
                <IconShield size={15} className="mr-2 rtl:ml-2 rtl:mr-0" />
                {t("ctaLabel")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function CountryToggle({
  countries,
  active,
  onSelect,
  tLabel,
}: {
  countries: JurisdictionRights[];
  active: CountryCode;
  onSelect: (c: CountryCode) => void;
  tLabel: string;
}) {
  const locale = useLocale();
  const pl = (x: Localized) => (locale === "ar" ? x.ar : x.en);
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {tLabel}
      </span>
      <div role="tablist" className="inline-flex rounded-full border border-border/60 bg-card/60 p-1">
        {countries.map((c) => {
          const isActive = c.country === active;
          return (
            <button
              key={c.country}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(c.country)}
              className={cn(
                "relative rounded-full px-5 py-2 text-sm font-medium text-muted-foreground transition-colors",
                isActive && "text-foreground",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="country-pill"
                  className="absolute inset-0 rounded-full bg-primary/10 ring-1 ring-primary/30"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <span aria-hidden>{c.flag}</span>
                <span>{pl(c.name)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Toc({ meta }: { meta: { id: SectionKey; icon: React.ReactNode }[] }) {
  const t = useTranslations("rights.sections");
  const labels: Record<SectionKey, string> = {
    rights: t("rights"),
    duties: t("duties"),
    courses: t("courses"),
    evidence: t("evidence"),
    actions: t("actions"),
    templates: t("templates"),
    resources: t("resources"),
    disclaimer: t("verify"),
  };
  return (
    <nav aria-label="Table of contents" className="-mx-1 flex gap-2 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {meta.map((m) => (
        <a
          key={m.id}
          href={`#${m.id}`}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <span className="text-primary">{m.icon}</span>
          {labels[m.id]}
        </a>
      ))}
    </nav>
  );
}

function SectionHeading({
  icon,
  title,
  lead,
}: {
  icon: React.ReactNode;
  title: string;
  lead: string;
}) {
  return (
    <FadeIn>
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          {icon}
        </span>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{lead}</p>
    </FadeIn>
  );
}

function ActionCard({
  action,
  t,
  lbl,
}: {
  action: JurisdictionRights["actions"][number];
  t: (x: Localized) => string;
  lbl: { bestFor: string; evidence: string; steps: string; parallel: string; verify: string };
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
      >
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <IconScale size={16} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="observation">{t(action.eyebrow)}</Badge>
              {!action.verified && <Badge tone="warning">{lbl.verify}</Badge>}
            </div>
            <h3 className="mt-1.5 text-sm font-semibold tracking-tight">{t(action.title)}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(action.body)}</p>
          </div>
        </div>
        <span
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-full border border-border/60 transition-transform",
            open && "rotate-45",
          )}
        >
          <IconX size={13} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-5 border-t border-border/60 p-5 md:grid-cols-2">
              <div>
                <SubLabel>{lbl.bestFor}</SubLabel>
                <p className="text-sm leading-relaxed text-foreground/90">{t(action.bestFor)}</p>

                <SubLabel className="mt-4">{lbl.evidence}</SubLabel>
                <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                  {action.evidence.map((e) => (
                    <li key={e.en} className="flex items-start gap-2">
                      <IconCheck size={13} className="mt-1 shrink-0 text-primary" />
                      <span>{t(e)}</span>
                    </li>
                  ))}
                </ul>

                <SubLabel className="mt-4">{lbl.parallel}</SubLabel>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(action.parallel)}</p>
              </div>

              <div>
                <SubLabel>{lbl.steps}</SubLabel>
                <ol className="flex flex-col gap-3">
                  {action.steps.map((s, i) => (
                    <li key={s.title.en} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-medium text-primary ring-1 ring-primary/20">
                        {i + 1}
                      </span>
                      <div className="text-sm">
                        <div className="font-medium leading-relaxed">{t(s.title)}</div>
                        {s.authority && (
                          <Badge tone="neutral" className="mt-0.5">{s.authority}</Badge>
                        )}
                        <p className="mt-0.5 leading-relaxed text-muted-foreground">{t(s.body)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function SubLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)}>
      {children}
    </div>
  );
}

function TemplateCard({
  tmpl,
  locale,
  t,
  labels,
}: {
  tmpl: JurisdictionRights["templates"]["items"][number];
  locale: string;
  t: (x: Localized) => string;
  labels: { draft: string; copy: string; copied: string; reset: string };
}) {
  const tf = useTranslations("rights");
  const initial = React.useMemo(() => {
    const today = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
    return t(tmpl.body).replaceAll("{TODAY}", today);
  }, [tmpl, locale, t]);
  const [text, setText] = React.useState<string>(initial);
  const [copied, setCopied] = React.useState(false);
  const placeholders = (initial.match(/\{[A-Z_]+\}/g) ?? []).length;

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be unavailable; the user can still copy manually.
    }
  }, [text]);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 p-4">
        <div className="flex items-center gap-2">
          <Badge tone="neutral">{labels.draft}</Badge>
          <Badge tone="neutral">{t(tmpl.recipient)}</Badge>
        </div>
        <span className="text-sm font-semibold tracking-tight">{t(tmpl.title)}</span>
      </div>
      <div className="p-4">
        <textarea
          aria-label={t(tmpl.title)}
          dir="auto"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          className="h-64 w-full resize-y rounded-xl border border-border/60 bg-background/60 p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none transition-colors focus:border-primary/50"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {tf("placeholders", { N: placeholders })}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setText(initial)}>
              {labels.reset}
            </Button>
            <Button size="sm" onClick={copy}>
              {copied ? <IconCheck size={14} /> : <IconSend size={14} className="rtl:rotate-180" />}
              {copied ? labels.copied : labels.copy}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}