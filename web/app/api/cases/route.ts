import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { JURISDICTIONS } from "@/lib/constants";

const createCaseSchema = z.object({
  title: z.string().min(2).max(200),
  jurisdiction: z.enum(JURISDICTIONS),
  description: z.string().max(5000).optional(),
});

/** GET /api/cases — lists only the authenticated user's own cases (RLS enforced). */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("cases")
    .select("id,title,jurisdiction,status,updated_at")
    .order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cases: data });
}

/** POST /api/cases — owner_id is always the authenticated user; never trust client IDs. */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = createCaseSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { data, error } = await supabase
    .from("cases")
    .insert({
      owner_id: user.id,
      title: parsed.data.title,
      jurisdiction: parsed.data.jurisdiction,
      description: parsed.data.description ?? null,
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
