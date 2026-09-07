import { createHash } from "node:crypto";
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { EVIDENCE_CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const MAX_BYTES = 50 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
  "application/vnd.ms-outlook",
  "audio/*",
  "video/*",
]);

export async function POST(request: NextRequest) {
  const auth = await createServerClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const caseId = String(formData.get("caseId") ?? "").trim();
  const file = formData.get("file");
  if (!caseId || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing case or file" }, { status: 400 });
  }

  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }
  const mime = file.type || "application/octet-stream";
  const allowed = [...ALLOWED_MIME].some(
    (p) => p === mime || (p.endsWith("/*") && mime.startsWith(p.slice(0, -1))),
  );
  if (!allowed) {
    return NextResponse.json({ error: "unsupported_type" }, { status: 415 });
  }

  const category = String(formData.get("category") ?? "other");
  if (!EVIDENCE_CATEGORIES.includes(category as (typeof EVIDENCE_CATEGORIES)[number])) {
    return NextResponse.json({ error: "bad_category" }, { status: 400 });
  }
  const description = String(formData.get("description") ?? "").trim().slice(0, 2000);
  const rawDate = String(formData.get("documentDate") ?? "").trim();
  const documentDate = /^\d{4}-\d{2}-\d{2}/.test(rawDate) ? rawDate : null;
  const clientHash = String(formData.get("clientHash") ?? "").toLowerCase();

  // Ownership gate (RLS-enforced via the authenticated client).
  const { data: owned } = await auth
    .from("cases")
    .select("id")
    .eq("id", caseId)
    .eq("owner_id", user.id)
    .single();
  if (!owned) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const serverHash = createHash("sha256").update(bytes).digest("hex");
  if (clientHash && serverHash !== clientHash) {
    return NextResponse.json({ error: "hash_mismatch" }, { status: 422 });
  }

  // Service-role client: all writes below are server-side only.
  const admin = createServiceClient();
  const evidenceId = randomUUID();
  const storagePath = `${user.id}/${caseId}/${evidenceId}/encrypted.bin`;

  const { error: uploadError } = await admin.storage
    .from("evidence")
    .upload(storagePath, bytes, { contentType: mime, upsert: false });
  if (uploadError) {
    return NextResponse.json({ error: "storage_failed" }, { status: 500 });
  }

  const { data: row, error: insertError } = await admin
    .from("evidence_files")
    .insert({
      id: evidenceId,
      case_id: caseId,
      original_filename: file.name,
      mime_type: mime,
      file_size_bytes: file.size,
      encrypted_storage_path: storagePath,
      sha256_hash: serverHash,
      category,
      description: description || null,
      document_date: documentDate,
      encryption_version: "bucket-v1",
    })
    .select("id")
    .single();

  if (insertError || !row) {
    await admin.storage.from("evidence").remove([storagePath]).catch(() => {});
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  await admin
    .from("evidence_integrity_events")
    .insert({
      evidence_file_id: evidenceId,
      actor_user_id: user.id,
      event_type: "upload_received",
      sha256_hash: serverHash,
      metadata: { channel: "web", client_hash_present: Boolean(clientHash) },
    })
    .select("id")
    .maybeSingle();

  return NextResponse.json(
    { id: evidenceId, sha256_hash: serverHash },
    { status: 201 },
  );
}

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}