"use server";

import { createClient } from "@/lib/supabase/server";
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