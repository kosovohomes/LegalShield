import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { DashboardClient } from "./_client";
import { createClient } from "@/lib/supabase/server";
import { JURISDICTIONS, type Jurisdiction } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("dashboard");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <AppShell>
        <div className="grid min-h-[60vh] place-items-center text-center">
          <div className="max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const { data: cases } = await supabase
    .from("cases")
    .select("id,title,jurisdiction,status,updated_at,created_at")
    .order("updated_at", { ascending: false });

  const { count: evidenceCount } = await supabase
    .from("evidence_files")
    .select("id", { count: "exact", head: true });

  const { count: requestCount } = await supabase
    .from("document_requests")
    .select("id", { count: "exact", head: true });

  const { data: profile } = await supabase
    .from("profiles")
    .select("default_jurisdiction")
    .eq("id", user.id)
    .single();

  const defaultJurisdiction: Jurisdiction | null =
    profile?.default_jurisdiction && JURISDICTIONS.includes(profile.default_jurisdiction as Jurisdiction)
      ? (profile.default_jurisdiction as Jurisdiction)
      : null;

  return (
    <AppShell>
      <DashboardClient
        locale={locale}
        email={user.email ?? ""}
        fullName={(user.user_metadata?.full_name as string) ?? null}
        cases={cases ?? []}
        evidenceCount={evidenceCount ?? 0}
        requestCount={requestCount ?? 0}
        defaultJurisdiction={defaultJurisdiction}
      />
    </AppShell>
  );
}
