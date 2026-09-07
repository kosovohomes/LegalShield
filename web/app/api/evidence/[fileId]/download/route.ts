import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await params;

  const auth = await createServerClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data: file } = await admin
    .from("evidence_files")
    .select("id,case_id,encrypted_storage_path,original_filename,deleted_at")
    .eq("id", fileId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!file) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { data: caseRow } = await admin
    .from("cases")
    .select("owner_id")
    .eq("id", file.case_id)
    .maybeSingle();
  if (!caseRow) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const isOwner = caseRow.owner_id === user.id;
  let isMember = false;
  if (!isOwner) {
    const { data: member } = await admin
      .from("case_members")
      .select("id,status")
      .eq("case_id", file.case_id)
      .eq("user_id", user.id)
      .maybeSingle();
    isMember = Boolean(member && member.status === "accepted");
  }
  if (!isOwner && !isMember) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { data: signed } = await admin.storage
    .from("evidence")
    .createSignedUrl(file.encrypted_storage_path, 60, {
      download: file.original_filename,
    });
  if (!signed?.signedUrl) {
    return NextResponse.json({ error: "storage_failed" }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl, 302);
}