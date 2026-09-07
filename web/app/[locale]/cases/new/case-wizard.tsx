"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Disclaimer } from "@/components/ui/disclaimer";
import {
  IconScale,
  IconBriefcase,
  IconHome,
  IconCar,
  IconHeart,
  IconTag,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  IconSparkles,
} from "@/components/ui/icons";
import { EVIDENCE_CATEGORIES, JURISDICTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type CaseType = {
  key: string;
  icon: React.ReactNode;
};

export const CASE_TYPES: CaseType[] = [
  { key: "labour", icon: <IconScale size={18} /> },
  { key: "commercial", icon: <IconBriefcase size={18} /> },
  { key: "real_estate", icon: <IconHome size={18} /> },
  { key: "traffic", icon: <IconCar size={18} /> },
  { key: "family", icon: <IconHeart size={18} /> },
  { key: "other", icon: <IconTag size={18} /> },
];

type WizardState = {
  jurisdiction: string;
  caseType: string;
  title: string;
  description: string;
  startedOn: string;
  opposingParty: string;
  lawyerName: string;
  haveDocs: string[];
};

type WizardResult = { ok: true; id: string } | { ok: false; error: string };

export function CaseWizard({
  locale,
  defaultJurisdiction,
  action,
}: {
  locale: string;
  defaultJurisdiction: string;
  action: (formData: FormData) => Promise<WizardResult>;
}) {
  const t = useTranslations("wizard");
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [state, setState] = React.useState<WizardState>({
    jurisdiction: defaultJurisdiction,
    caseType: "other",
    title: "",
    description: "",
    startedOn: "",
    opposingParty: "",
    lawyerName: "",
    haveDocs: [],
  });

  const total = 4;
  const canNext =
    step === 0 ? state.title.trim().length >= 2 : true;

  function set<K extends keyof WizardState>(key: K, value: WizardState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function toggleDoc(key: string) {
    setState((s) => ({
      ...s,
      haveDocs: s.haveDocs.includes(key)
        ? s.haveDocs.filter((k) => k !== key)
        : [...s.haveDocs, key],
    }));
  }

  async function submit() {
    if (!canNext) return;
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("jurisdiction", state.jurisdiction);
    fd.set("caseType", state.caseType);
    fd.set("title", state.title);
    fd.set("description", state.description);
    fd.set("startedOn", state.startedOn);
    fd.set("opposingParty", state.opposingParty);
    fd.set("lawyerName", state.lawyerName);
    state.haveDocs.forEach((d) => fd.append("haveDocs", d));
    const res = await action(fd);
    if (res.ok) {
      router.push(`/${locale}/cases/${res.id}`);
    } else {
      setError(res.error ?? t("errorGeneric"));
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          <span>{t("eyebrow")}</span>
          <span>
            {t("stepProgress", { current: step + 1, total })}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 overflow-hidden rounded-full bg-muted"
            >
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={false}
                animate={{ width: i <= step ? "100%" : "0%" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {t("matterTitle")}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("matterHint")}
                  </p>
                </div>

                <Field label={t("caseTypeLabel")}>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {CASE_TYPES.map((ct) => {
                      const active = state.caseType === ct.key;
                      return (
                        <button
                          key={ct.key}
                          type="button"
                          onClick={() => set("caseType", ct.key)}
                          className={cn(
                            "flex flex-col items-start gap-2 rounded-xl border p-3 text-start transition-colors",
                            active
                              ? "border-primary bg-primary/5"
                              : "border-border/60 bg-card/40 hover:border-primary/40 hover:bg-card",
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-8 place-items-center rounded-lg ring-1",
                              active
                                ? "bg-primary/10 text-primary ring-primary/20"
                                : "bg-card text-muted-foreground ring-border/60",
                            )}
                          >
                            {ct.icon}
                          </span>
                          <span className="text-sm font-medium">
                            {t(`caseTypes.${ct.key}`)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <Field label={t("titleLabel")} hint={t("titleHint")}>
                  <Input
                    name="title"
                    value={state.title}
                    onChange={(e) => set("title", e.target.value)}
                    maxLength={200}
                    placeholder={t("titlePlaceholder")}
                    autoFocus
                  />
                </Field>

                <Field label={t("jurisdictionLabel")}>
                  <div className="grid grid-cols-2 gap-2">
                    {JURISDICTIONS.map((j) => (
                      <button
                        key={j}
                        type="button"
                        onClick={() => set("jurisdiction", j)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-3 text-start transition-colors",
                          state.jurisdiction === j
                            ? "border-primary bg-primary/5"
                            : "border-border/60 bg-card/40 hover:border-primary/40 hover:bg-card",
                        )}
                      >
                        <span className="text-sm font-medium">
                          {j === "KW" ? "Kuwait · الكويت" : "Jordan · الأردن"}
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {t("storyTitle")}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("storyHint")}
                  </p>
                </div>
                <Field
                  label={t("descriptionLabel")}
                  hint={t("storyHintOptional")}
                >
                  <Textarea
                    value={state.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={6}
                    maxLength={5000}
                    placeholder={t("descriptionPlaceholder")}
                  />
                </Field>
                <Field label={t("startedLabel")}>
                  <Input
                    type="date"
                    value={state.startedOn}
                    onChange={(e) => set("startedOn", e.target.value)}
                  />
                </Field>
                <p className="text-xs text-muted-foreground">
                  {t("storyCaveat")}
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {t("partiesTitle")}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("partiesHint")}
                  </p>
                </div>
                <Field label={t("opposingLabel")}>
                  <Input
                    value={state.opposingParty}
                    onChange={(e) => set("opposingParty", e.target.value)}
                    maxLength={200}
                    placeholder={t("opposingPlaceholder")}
                  />
                </Field>
                <Field label={t("lawyerLabel")} hint={t("lawyerHint")}>
                  <Input
                    value={state.lawyerName}
                    onChange={(e) => set("lawyerName", e.target.value)}
                    maxLength={200}
                    placeholder={t("lawyerPlaceholder")}
                  />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {t("papersTitle")}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("papersHint")}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {EVIDENCE_CATEGORIES.map((c) => {
                    const active = state.haveDocs.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleDoc(c)}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-xl border p-3 text-start transition-colors",
                          active
                            ? "border-primary bg-primary/5"
                            : "border-border/60 bg-card/40 hover:border-primary/40 hover:bg-card",
                        )}
                      >
                        <span className="text-sm font-medium">
                          {t(`categories.${c}`)}
                        </span>
                        <span
                          className={cn(
                            "grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border",
                          )}
                        >
                          {active && <IconCheck size={12} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {step === 3 && (
          <Disclaimer tone="info" className="mt-5">
            {t("papersCaveat")}
          </Disclaimer>
        )}
        {step === 0 && (
          <div className="mt-5 rounded-2xl border border-border/60 bg-card/40 p-4 text-sm">
            <div className="font-medium">{t("iDontKnow")}</div>
            <div className="mt-1 text-muted-foreground">{t("iDontKnowBody")}</div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || busy}
            className="gap-1"
          >
            <IconArrowLeft size={14} className="rtl:rotate-180" />
            {t("back")}
          </Button>
          {step < total - 1 ? (
            <Button
              type="button"
              size="sm"
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              className="gap-1"
            >
              {t("next")}
              <IconArrowRight size={14} className="rtl:rotate-180" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={submit}
              disabled={busy}
              className="gap-2"
            >
              <IconSparkles size={14} />
              {busy ? t("creating") : t("create")}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}