import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { CasesListClient } from "./_client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/routing";

export default async function CasesPage({
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

  const { data: cases } = await supabase
    .from("cases")
    .select("id,title,jurisdiction,status,description,updated_at,created_at")
    .order("updated_at", { ascending: false });

  return (
    <AppShell>
      <CasesListClient
        locale={locale}
        cases={(cases ?? []).map((c) => ({
          ...c,
          description: c.description,
        }))}
      />
    </AppShell>
  );
}
