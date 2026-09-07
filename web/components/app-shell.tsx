"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconShield,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  IconCompass,
  IconFile,
  IconClock,
  IconWallet,
  IconSend,
  IconBook,
  IconDownload,
  IconPlus,
  IconSparkles,
  IconLock,
  IconUpload,
  IconAlert,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type NavKey = "dashboard" | "cases" | "settings";

const NAV: { key: NavKey; href: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: "dashboard", href: "/[locale]/dashboard", icon: IconCompass },
  { key: "cases", href: "/[locale]/cases", icon: IconFile },
  { key: "settings", href: "/[locale]/settings", icon: IconShield },
];

export function AppShell({
  children,
  variant = "app",
}: {
  children: React.ReactNode;
  variant?: "app" | "case";
}) {
  const t = useTranslations();
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [signingOut, setSigningOut] = React.useState(false);

  const nav = React.useMemo(
    () =>
      NAV.map((n) => ({
        ...n,
        href: "/" + locale + n.href.replace("/[locale]", ""),
        active: pathname.startsWith("/" + locale + n.href.replace("/[locale]", "")),
      })),
    [locale, pathname],
  );

  async function signOut() {
    setSigningOut(true);
    try {
      const sb = createClient();
      await sb.auth.signOut();
      router.push("/" + locale);
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="min-h-dvh">
      <div className="aurora fixed inset-x-0 top-0 h-[420px] opacity-60" aria-hidden />
      <div className="grid-bg absolute inset-x-0 top-0 h-[420px] opacity-30" aria-hidden />

      <div className="relative mx-auto flex min-h-dvh max-w-[1400px] gap-0 px-4 sm:px-6">
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col py-6 lg:flex">
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center gap-2 px-3 font-semibold"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
              <IconShield size={16} />
            </span>
            {t("brand.name")}
          </Link>

          <nav className="mt-8 flex flex-col gap-1">
            {nav.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.key}
                  href={n.href}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
                    n.active
                      ? "bg-card text-foreground ring-1 ring-border"
                      : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
                  )}
                >
                  <Icon
                    size={16}
                    className={cn(
                      "transition-colors",
                      n.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  {t(`nav.${n.key}`)}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-border/70 bg-card/70 p-3 text-xs text-muted-foreground backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-foreground">
              <IconLock size={12} className="text-primary" />
              {t("security.eyebrow")}
            </div>
            <p className="mt-1.5 leading-relaxed">{t("boundaries.isNot")}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-start"
              onClick={signOut}
              disabled={signingOut}
            >
              {t("nav.signOut")}
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 -mx-4 mb-6 flex h-16 items-center justify-between border-b border-border/60 bg-background/60 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
            {variant === "case" ? (
              <Button asChild variant="ghost" size="sm" className="gap-1.5">
                <Link href={`/${locale}/cases`}>
                  <IconArrowLeft size={14} className="rtl:rotate-180" />
                  {t("nav.cases")}
                </Link>
              </Button>
            ) : (
              <Link href={`/${locale}`} className="font-semibold lg:hidden">
                {t("brand.name")}
              </Link>
            )}
            <div className="flex items-center gap-2">
              <Badge tone="verified" className="hidden sm:inline-flex">
                <IconCheck size={10} />
                client-side encrypted
              </Badge>
              <Button asChild size="sm" className="gap-1.5">
                <Link href={`/${locale}/cases/new`}>
                  <IconPlus size={14} />
                  {t("case.new")}
                </Link>
              </Button>
            </div>
          </header>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pb-16"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
