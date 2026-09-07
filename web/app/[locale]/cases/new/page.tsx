import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { JURISDICTIONS } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const schema = z.object({
  title: z.string().min(2).max(200),
  jurisdiction: z.enum(JURISDICTIONS),
  description: z.string().max(5000).optional(),
});

export default async function NewCasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  async function createCase(formData: FormData) {
    "use server";
    const parsed = schema.safeParse({
      title: formData.get("title"),
      jurisdiction: formData.get("jurisdiction"),
      description: formData.get("description") || undefined,
    });
    if (!parsed.success) return;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    // Server-side ownership: owner_id always = authenticated user, never client-supplied.
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
    if (!error && data) redirect(`/${locale}/cases/${data.id}`);
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>New case</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCase} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm">
              Title
              <input
                name="title"
                required
                minLength={2}
                maxLength={200}
                className="rounded-md border border-zinc-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Jurisdiction
              <select
                name="jurisdiction"
                required
                className="rounded-md border border-zinc-300 px-3 py-2"
              >
                <option value="KW">Kuwait (KW)</option>
                <option value="JO">Jordan (JO)</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Description
              <textarea
                name="description"
                rows={4}
                maxLength={5000}
                className="rounded-md border border-zinc-300 px-3 py-2"
              />
            </label>
            <Button type="submit">Create case</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
