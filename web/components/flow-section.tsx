"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Stagger, StaggerItem } from "@/components/motion-primitives";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import {
  IconFile,
  IconClock,
  IconWallet,
  IconSend,
  IconCompass,
  IconUsers,
  IconCheck,
} from "@/components/ui/icons";

const steps = [
  { key: "evidence", icon: IconFile },
  { key: "timeline", icon: IconClock },
  { key: "expenses", icon: IconWallet },
  { key: "requests", icon: IconSend },
  { key: "verification", icon: IconCompass },
  { key: "professional", icon: IconUsers },
] as const;

export function FlowSection() {
  const t = useTranslations();
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <Stagger className="flex flex-col items-center text-center">
        <StaggerItem>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            {t("flow.eyebrow")}
          </span>
        </StaggerItem>
        <StaggerItem>
          <h2 className="mt-3 max-w-2xl text-balance text-4xl font-semibold tracking-tight">
            {t("flow.title")}
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className="mt-4 max-w-2xl text-balance text-muted-foreground">
            {t("flow.subtitle")}
          </p>
        </StaggerItem>
      </Stagger>

      <Stagger className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <StaggerItem key={step.key}>
              <Card className="group h-full p-6 transition-colors hover:border-primary/30">
                <div className="flex items-start justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:-rotate-6">
                    <Icon size={18} />
                  </span>
                  <span className="text-5xl font-semibold leading-none text-foreground/5 transition-colors group-hover:text-primary/10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {t(`flow.steps.${step.key}.title`)}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {t(`flow.steps.${step.key}.body`)}
                </p>
                <ul className="mt-4 space-y-1.5 text-sm text-foreground/80">
                  {(t.raw(`flow.steps.${step.key}.points`) as string[]).map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <IconCheck size={14} className="mt-1 shrink-0 text-primary" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Stagger className="mt-12">
        <StaggerItem>
          <Disclaimer tone="warning">
            {t("flow.caveat")}
          </Disclaimer>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
