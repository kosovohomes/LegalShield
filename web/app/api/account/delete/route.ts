import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Account deletion: deletes all rows the user owns and the auth user record.
 * Uses the service-role key server-side after verifying the caller's session.
 * Real production: do this in a background job with explicit audit logging.
 */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Delete child rows first; RLS will scope to this user.
  await supabase.from("audit_logs").delete().eq("user_id", user.id);
  await supabase.from("consent_records").delete().eq("user_id", user.id);
  await supabase.from("case_members").delete().eq("user_id", user.id);

  // Cases cascade to evidence/timeline/expenses/etc. via FKs.
  await supabase.from("cases").delete().eq("owner_id", user.id);

  await supabase.from("profiles").delete().eq("id", user.id);

  // Mark the auth user for deletion using service role.
  // We do this via the admin endpoint through a server-side call below.
  // The anon client cannot delete auth users, so we use a service-role client.
  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
