import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
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
      .select("id,original_filename,mime_type,file_size_bytes,sha256_hash,category,description,document_date,created_at,encryption_version")
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

  const evidenceRows = evidence.data ?? [];
  const manualRows = timeline.data ?? [];

  const evidenceTimeline = evidenceRows
    .filter((e) => e.document_date)
    .map((e) => ({
      id: `ev-${e.id}`,
      event_date: e.document_date,
      title: e.original_filename,
      description: null,
      classification: "document_observation",
      source_evidence_id: e.id,
      created_at: e.created_at,
    }));

  const mergedTimeline = [...manualRows, ...evidenceTimeline].sort(
    (a, b) =>
      new Date(b.event_date ?? b.created_at).getTime() -
      new Date(a.event_date ?? a.created_at).getTime(),
  );

  return (
    <AppShell variant="case">
      <CaseWorkspace
        locale={locale}
        activeTab={tab ?? "overview"}
        caseId={id}
        caseRow={c}
        evidence={evidenceRows}
        timeline={mergedTimeline}
        expenses={expenses.data ?? []}
        requests={requests.data ?? []}
        categories={EVIDENCE_CATEGORIES as readonly string[]}
      />
    </AppShell>
  );
}
