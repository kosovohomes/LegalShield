"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { TIMELINE_CLASSIFICATIONS } from "@/lib/constants";

export async function addTimelineEvent(
  caseId: string,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 2 || title.length > 300) return { ok: false, error: "title" };
  const description = String(formData.get("description") ?? "").trim().slice(0, 2000);
  const rawDate = String(formData.get("eventDate") ?? "").trim();
  const eventDate = /^\d{4}-\d{2}-\d{2}/.test(rawDate) ? rawDate : null;
  const rawClass = String(formData.get("classification") ?? "user_fact");
  const classification = TIMELINE_CLASSIFICATIONS.includes(
    rawClass as (typeof TIMELINE_CLASSIFICATIONS)[number],
  )
    ? rawClass
    : "user_fact";

  const { error } = await supabase
    .from("timeline_events")
    .insert({
      case_id: caseId,
      title,
      description: description || null,
      event_date: eventDate,
      classification,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: "generic" };
  return { ok: true };
}

export async function saveDocumentRequest(
  caseId: string,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  const summary = String(formData.get("summary") ?? "").trim().slice(0, 5000);
  const requestedItems = String(formData.get("requestedItems") ?? "").trim().slice(0, 5000);
  const generatedText = String(formData.get("generatedText") ?? "").trim().slice(0, 50_000);
  if (summary.length < 1 || generatedText.length < 1) {
    return { ok: false, error: "invalid" };
  }

  const admin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data: caseRow } = await admin
    .from("cases")
    .select("owner_id")
    .eq("id", caseId)
    .maybeSingle();
  if (!caseRow || caseRow.owner_id !== user.id) {
    return { ok: false, error: "auth" };
  }

  const { error } = await admin.from("document_requests").insert({
    case_id: caseId,
    request_type: "factual_request",
    factual_summary: summary,
    requested_items: requestedItems || null,
    generated_text: generatedText,
    legal_basis: null,
    template_version: "ls-factual-request-v0.1",
    status: "draft",
  });

  if (error) return { ok: false, error: "generic" };
  return { ok: true };
}