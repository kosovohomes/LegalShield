import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { SettingsClient } from "./_client";
import { createClient } from "@/lib/supabase/server";
import { JURISDICTIONS, type Jurisdiction } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name,phone,preferred_language,default_jurisdiction")
    .eq("id", user.id)
    .single();

  return (
    <AppShell>
      <SettingsClient
        locale={locale}
        email={user.email ?? ""}
        profile={{
          full_name: profile?.full_name ?? null,
          phone: profile?.phone ?? null,
          preferred_language: (profile?.preferred_language as "ar" | "en" | null) ?? "ar",
          default_jurisdiction:
            profile?.default_jurisdiction && JURISDICTIONS.includes(profile.default_jurisdiction as Jurisdiction)
              ? (profile.default_jurisdiction as Jurisdiction)
              : null,
        }}
      />
    </AppShell>
  );
}
