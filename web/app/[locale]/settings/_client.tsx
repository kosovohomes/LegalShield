"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import {
  IconShield,
  IconKey,
  IconDownload,
  IconCompass,
  IconUsers,
  IconCheck,
  IconArrowRight,
} from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/client";
import { JURISDICTIONS, type Jurisdiction } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Profile = {
  full_name: string | null;
  phone: string | null;
  preferred_language: "ar" | "en";
  default_jurisdiction: Jurisdiction | null;
};

const SECTIONS = [
  { key: "profile", icon: IconUsers },
  { key: "account", icon: IconShield },
  { key: "security", icon: IconKey },
  { key: "data", icon: IconDownload },
  { key: "support", icon: IconCompass },
] as const;

export function SettingsClient({
  locale,
  email,
  profile: initialProfile,
}: {
  locale: string;
  email: string;
  profile: Profile;
}) {
  const t = useTranslations("settings");
  const common = useTranslations("common");
  const [profile, setProfile] = React.useState<Profile>(initialProfile);
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [active, setActive] = React.useState<(typeof SECTIONS)[number]["key"]>("profile");

  async function saveProfile(formData: FormData) {
    "use client" as const;
    setSavingProfile(true);
    try {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;
      const full_name = String(formData.get("full_name") ?? "").trim() || null;
      const phone = String(formData.get("phone") ?? "").trim() || null;
      const preferred_language =
        (String(formData.get("preferred_language") ?? "ar") as "ar" | "en");
      const jurisdiction = String(formData.get("default_jurisdiction") ?? "") || null;
      const { error } = await sb
        .from("profiles")
        .update({
          full_name,
          phone,
          preferred_language,
          default_jurisdiction: jurisdiction as Jurisdiction | null,
        })
        .eq("id", user.id);
      if (error) throw error;
      setProfile({ full_name, phone, preferred_language, default_jurisdiction: jurisdiction as Jurisdiction | null });
      toast.success(common("saved"));
    } catch (e: any) {
      toast.error(e?.message ?? "Could not save");
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        <nav className="mt-6 flex flex-col gap-1 lg:sticky lg:top-20">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                  active === s.key
                    ? "bg-card text-foreground ring-1 ring-border"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
                )}
              >
                <Icon size={14} className={active === s.key ? "text-primary" : ""} />
                {t(`sections.${s.key}`)}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-col gap-6">
        {active === "profile" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card className="p-6">
              <h2 className="text-base font-semibold tracking-tight">{t("sections.profile")}</h2>
              <form action={saveProfile} className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label={t("profile.fullName")}>
                  <Input
                    name="full_name"
                    defaultValue={profile.full_name ?? ""}
                    maxLength={120}
                  />
                </Field>
                <Field label={t("profile.phone")}>
                  <Input
                    name="phone"
                    type="tel"
                    defaultValue={profile.phone ?? ""}
                    maxLength={40}
                  />
                </Field>
                <Field label={t("profile.language")}>
                  <select
                    name="preferred_language"
                    defaultValue={profile.preferred_language}
                    className="h-10 w-full rounded-xl border border-input bg-background/60 px-3.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </Field>
                <Field label={t("profile.jurisdiction")}>
                  <select
                    name="default_jurisdiction"
                    defaultValue={profile.default_jurisdiction ?? ""}
                    className="h-10 w-full rounded-xl border border-input bg-background/60 px-3.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <option value="">—</option>
                    {JURISDICTIONS.map((j) => (
                      <option key={j} value={j}>
                        {j === "KW" ? "Kuwait · الكويت" : "Jordan · الأردن"}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="sm:col-span-2 flex justify-end">
                  <Button type="submit" disabled={savingProfile}>
                    {savingProfile ? common("saving") : common("save")}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {active === "account" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card className="p-6">
              <h2 className="text-base font-semibold tracking-tight">{t("sections.account")}</h2>
              <div className="mt-4 grid gap-4">
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {t("account.email")}
                    </div>
                    <div className="mt-0.5 text-sm font-medium">{email}</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("account.emailHint")}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    {t("account.changeEmail")}
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {t("account.password")}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">••••••••</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/${locale}/reset-password`}>
                      {t("account.changePassword")}
                      <IconArrowRight size={12} className="rtl:rotate-180" />
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                  <div>
                    <div className="text-sm font-medium">{t("account.delete")}</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("account.deleteHint")}
                    </p>
                  </div>
                  <Button asChild variant="destructive" size="sm">
                    <Link href={`/${locale}/settings/delete`}>{t("account.delete")}</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {active === "security" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card className="p-6">
              <h2 className="text-base font-semibold tracking-tight">{t("sections.security")}</h2>
              <div className="mt-4 grid gap-4">
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-4">
                  <div>
                    <div className="text-sm font-medium">{t("security.mfa")}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{t("security.mfaHint")}</p>
                  </div>
                  <Badge tone="warning">Recommended</Badge>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{t("security.recoveryKey")}</div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("security.recoveryKeyHint")}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Generate
                    </Button>
                  </div>
                </div>
                <Disclaimer tone="info">
                  Sessions and active devices are listed here once multi-factor and recovery-key
                  features ship in Build 02.
                </Disclaimer>
              </div>
            </Card>
          </motion.div>
        )}

        {active === "data" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card className="p-6">
              <h2 className="text-base font-semibold tracking-tight">{t("sections.data")}</h2>
              <div className="mt-4 grid gap-4">
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-4">
                  <div>
                    <div className="text-sm font-medium">{t("data.export")}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{t("data.exportHint")}</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    {common("comingSoon")}
                  </Button>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/40 p-4">
                  <div className="text-sm font-medium">{t("data.retention")}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{t("data.retentionHint")}</p>
                  <select
                    defaultValue="account_lifetime"
                    className="mt-3 h-10 w-full max-w-xs rounded-xl border border-input bg-background/60 px-3.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <option value="account_lifetime">Until account deletion (default)</option>
                    <option value="6m">6 months after last activity</option>
                    <option value="1y">1 year after last activity</option>
                    <option value="3y">3 years after last activity</option>
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {active === "support" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card className="p-6">
              <h2 className="text-base font-semibold tracking-tight">{t("sections.support")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t("support.title")}</p>
              <p className="text-sm text-muted-foreground">{t("support.body")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/${locale}/contact`}>{t("support.cta")}</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/${locale}/security`}>{t("security.eyebrow")}</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/${locale}/privacy`}>{t("footer.privacy")}</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
