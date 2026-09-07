"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";
import { motion } from "framer-motion";

export function CtaSection({ locale }: { locale: string }) {
  const t = useTranslations();
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-10 backdrop-blur-xl sm:p-16"
      >
        <div className="aurora" aria-hidden />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">{t("cta.subtitle")}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Button asChild size="xl" className="gap-2">
              <Link href={`/${locale}/cases/new`}>
                {t("hero.ctaPrimary")}
                <IconArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href={`/${locale}/how`}>{t("hero.ctaSecondary")}</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
