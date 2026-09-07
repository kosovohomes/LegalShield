import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { CaseWorkspace } from "./_workspace";
import { createClient } from "@/lib/supabase/server";
import { EVIDENCE_CATEGORIES } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

export default async function CaseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale, id } = await params;
  const { tab } = await searchParams;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("case");
  const supabase = await createClient();
  const { data: c } = await supabase
    .from("cases")
    .select("id,title,jurisdiction,status,description,created_at,updated_at")
    .eq("id", id)
    .single();
  if (!c) notFound();

  const [evidence, timeline, expenses, requests] = await Promise.all([
    supabase
      .from("evidence_files")
      .select("id,original_filename,mime_type,file_size_bytes,sha256_hash,category,created_at,encryption_version")
      .eq("case_id", id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(60),
    supabase
      .from("timeline_events")
      .select("id,event_date,title,description,classification,created_at")
      .eq("case_id", id)
      .order("event_date", { ascending: false, nullsFirst: false })
      .limit(60),
    supabase
      .from("expense_records")
      .select("id,expense_date,amount,currency,claimed_purpose,status,payee,created_at")
      .eq("case_id", id)
      .order("expense_date", { ascending: false, nullsFirst: false })
      .limit(60),
    supabase
      .from("document_requests")
      .select("id,request_type,factual_summary,status,created_at")
      .eq("case_id", id)
      .order("created_at", { ascending: false })
      .limit(60),
  ]);

  return (
    <AppShell variant="case">
      <CaseWorkspace
        locale={locale}
        activeTab={tab ?? "overview"}
        caseRow={c}
        evidence={evidence.data ?? []}
        timeline={timeline.data ?? []}
        expenses={expenses.data ?? []}
        requests={requests.data ?? []}
        categories={EVIDENCE_CATEGORIES as readonly string[]}
      />
    </AppShell>
  );
}
