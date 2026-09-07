"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { Disclaimer } from "@/components/ui/disclaimer";
import { IconShield, IconLock, IconArrowRight, IconArrowLeft } from "@/components/ui/icons";
import { Stagger, StaggerItem } from "@/components/motion-primitives";

export type AuthAlert = { tone: "info" | "success" | "error"; message: string } | null;

export function AuthShell({
  title,
  subtitle,
  children,
  alert,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  alert?: AuthAlert;
}) {
  const t = useTranslations();
  const brand = useTranslations("brand");
  const dis = useTranslations("disclaimers");
  const { locale } = useParams<{ locale: string }>();

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="aurora" aria-hidden />
      <div className="grid-bg absolute inset-0 opacity-30" aria-hidden />

      <div className="relative mx-auto grid min-h-dvh max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
        <div className="hidden lg:block">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <IconArrowLeft size={14} className="rtl:rotate-180" />
            {brand("name")}
          </Link>
          <Stagger className="mt-12 flex flex-col gap-4">
            <StaggerItem>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <IconLock size={12} className="text-primary" />
                client-side encrypted
              </span>
            </StaggerItem>
            <StaggerItem>
              <h1 className="max-w-md text-balance text-4xl font-semibold leading-tight tracking-[-0.02em]">
                {title}
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="max-w-md text-muted-foreground">{subtitle}</p>
            </StaggerItem>
            <StaggerItem>
              <Disclaimer tone="info">{dis("aiAnalysis")}</Disclaimer>
            </StaggerItem>
          </Stagger>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-sm"
        >
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <IconArrowLeft size={14} className="rtl:rotate-180" />
              {brand("name")}
            </Link>
          </div>
          <Card className="p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <IconShield size={16} />
              </span>
              <div>
                <div className="text-sm font-semibold">{brand("name")}</div>
                <div className="text-xs text-muted-foreground">{title}</div>
              </div>
            </div>

            {alert && (
              <div
                role="alert"
                className={
                  alert.tone === "success"
                    ? "mb-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-foreground"
                    : alert.tone === "error"
                    ? "mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-foreground"
                    : "mb-4 rounded-xl border border-border/60 bg-card/40 px-3 py-2 text-sm text-foreground"
                }
              >
                {alert.message}
              </div>
            )}

            {children}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
